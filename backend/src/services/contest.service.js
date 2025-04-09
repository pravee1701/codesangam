import axios from "axios";
import Contest from "../models/contest.model.js";


export const fetchContestsFromAPIs = async () => {
    const platforms = [
        { name: "Codeforces", url: "https://codeforces.com/api/contest.list" },
        { name: "CodeChef", url: "https://www.codechef.com/api/contests" },
        { name: "LeetCode", url: "https://leetcode.com/contest/api/" },
    ];

    for(const platform of platforms){
        try {
            const response = await axios.get(platform.url);
            const contests = parseContests(platform.name, response.data);

            await Contest.insertMany(contests, { ordered: false});

        } catch (error) {
            console.error(`Failed to fetch contests from ${platform.name} : `, error.message);
        }
    }
};

const parseContests = (platform, data) => {
    const now = new Date();

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
        return data.contests.map((contest) => {
            const startTime = new Date(contest.startDate);
            const endTime = new Date(contest.endDate);
            const duration = Math.round((endTime - startTime) / (1000 * 60)); // Convert milliseconds to minutes

            let status = "upcoming";
            if (startTime <= now && endTime > now) {
                status = "ongoing";
            } else if (endTime <= now) {
                status = "past";
            }

            return {
                platform,
                name: contest.name,
                url: `https://www.codechef.com/${contest.code}`,
                startTime,
                endTime,
                duration,
                status,
            };
        });
    }

    if (platform === "LeetCode") {
        return data.contests.map((contest) => {
            const startTime = new Date(contest.startTime * 1000);
            const endTime = new Date(contest.endTime * 1000);
            const duration = Math.round((endTime - startTime) / (1000 * 60)); // Convert milliseconds to minutes

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

    return [];
};