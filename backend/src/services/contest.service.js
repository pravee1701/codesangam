import axios from "axios";
import Contest from "../models/contest.model.js";
import { deleteCachedData } from "../utils/redisClient.js";
import { fetchVideosFromPlaylist } from "./youtube.service.js";
import { PLAYLISTS } from "../constants.js";

export const fetchContestsFromAPIs = async () => {
    const platforms = [
        { name: "Codeforces", url: process.env.CODEFORCES_CONTEST_URL },
        { name: "CodeChef", url: process.env.CODECHEF_CONTEST_URL },
        { name: "LeetCode", url: process.env.LEETCODE_CONTEST_URL},
    ];

    for (const platform of platforms) {
        try {
            let response;
            if (platform.name === "LeetCode") {
                const query = {
                    query: `
                        query {
                            allContests {
                                title
                                titleSlug
                                startTime
                                duration
                                description
                                isVirtual
                            }
                        }
                    `,
                };

                response = await axios.post(platform.url, query, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                response = await axios.get(platform.url);
            }
            const contests = parseContests(platform.name, response.data);
            const bulkOperations = contests.map((contest) => ({
                updateOne: {
                    filter: { platform: contest.platform, name: contest.name },
                    update: { $set: contest },
                    upsert: true,
                },
            }));

            await Contest.bulkWrite(bulkOperations);

            await deleteCachedData("contests:upcoming");
            await deleteCachedData("contests:past");
            await deleteCachedData(`contests:filter:${platform.name}`);
        } catch (error) {
            console.error(`Failed to fetch contests from ${platform.name}:`, error.message);
        }
    }
};

const parseContests = (platform, data) => {
    const now = new Date();
    const contests = [];

    if (platform === "Codeforces") {
        return data.result.map((contest) => {
            const startTime = new Date(contest.startTimeSeconds * 1000);
            const endTime = new Date(contest.startTimeSeconds * 1000 + contest.durationSeconds * 1000);
            const duration = Math.round(contest.durationSeconds / 60);

            let status = "upcoming";
            if (startTime <= now && endTime > now) {
                status = "ongoing";
            } else if (endTime <= now) {
                status = "past";
            }

            return {
                platform,
                name: contest.name,
                url: `https://codeforces.com/contest/${contest.id}`,
                startTime,
                endTime,
                duration,
                status,
            };
        });
    }

    if (platform === "CodeChef") {
        const contestTypes = {
            future_contests: "upcoming",
            present_contests: "ongoing",
            past_contests: "past",
        };

        Object.keys(contestTypes).forEach((type) => {
            if (data[type]) {
                data[type].forEach((contest) => {
                    contests.push({
                        platform,
                        name: contest.contest_name,
                        url: `https://www.codechef.com/${contest.contest_code}`,
                        startTime: new Date(contest.contest_start_date_iso),
                        endTime: new Date(contest.contest_end_date_iso),
                        duration: parseInt(contest.contest_duration, 10), // Duration in minutes
                        status: contestTypes[type],
                    });
                });
            }
        });

    }

    if (platform === "LeetCode") {
        return data.data.allContests.map((contest) => {
            const startTime = new Date(contest.startTime * 1000);
            const endTime = new Date(contest.startTime * 1000 + contest.duration * 1000);
            const duration = Math.round(contest.duration / 60); // Convert seconds to minutes

            let status = "upcoming";
            if (startTime <= now && endTime > now) {
                status = "ongoing";
            } else if (endTime <= now) {
                status = "past";
            }

            return {
                platform,
                name: contest.title,
                url: `https://leetcode.com/contest/${contest.titleSlug}`,
                startTime,
                endTime,
                duration,
                status,
            };
        });
    }
    return contests;
};

export const updateSolutionLinks = async () => {
    try {
        for (const [platform, playlistId] of Object.entries(PLAYLISTS)) {
            const videos = await fetchVideosFromPlaylist(playlistId);
            
            // Get all contests for this platform at once
            const allPlatformContests = await Contest.find({ platform });
            
            // Create a batch of updates
            const bulkOps = [];
            let matchCount = 0;
            
            for (const video of videos) {
                // Find the best matching contest for this video
                let bestMatch = null;
                let bestScore = 0;
                
                for (const contest of allPlatformContests) {
                    // Check if video title contains contest name
                    if (video.title.toLowerCase().includes(contest.name.toLowerCase())) {
                        // Use the length of the contest name as a score to prefer longer/more specific matches
                        const score = contest.name.length;
                        if (score > bestScore) {
                            bestScore = score;
                            bestMatch = contest;
                        }
                    }
                }
                
                if (bestMatch) {
                    // Add to bulk operation
                    bulkOps.push({
                        updateOne: {
                            filter: { _id: bestMatch._id },
                            update: { $set: { solutionVideoId: video.url } }
                        }
                    });
                    matchCount++;
                }
            }
            
            // Execute bulk operation if there are matches
            if (bulkOps.length > 0) {
                const result = await Contest.bulkWrite(bulkOps);
            } 
            
        }
        console.log("Solution links update complete!");
    } catch (error) {
        console.error("Error updating solution links:", error);
    }
};