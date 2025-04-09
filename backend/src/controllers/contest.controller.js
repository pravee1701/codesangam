import Contest from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheData, getCachedData } from "../utils/redisClient.js";

export const getUpcomingContests = asyncHandler(async (req, res) => {
    const cacheKey = "contests:upcoming";
    const cachedContests = await getCachedData(cacheKey);
    if (cachedContests) {
        return res.status(200).json(
            new ApiResponse(200, cachedContests, "Upcoming contest retrieved successfully")
        );
    }
    const contest = await Contest.find({ status: "upcoming" }).sort({ startTime: 1 });

    await cacheData(cacheKey, contests, 3600);

    res.status(200)
        .json(
            new ApiResponse(
                200,
                contest,
                "Contests retrieved successfully"
            )
        );
});

export const getPastContests = asyncHandler(
    async (req, res) => {

        const cacheKey = "contests:past";
        const cachedContests = await getCachedData(cacheKey);
        if (cachedContests) {
            return res.status(200).json(
                new ApiResponse(200, cachedContests, "Past contest retrieved successfully")
            );
        }
        const contest = await Contest.find({ status: "past" }).sort({ endTime: -1 });

        await cacheData(cacheKey, contests, 3600);

        res.status(200).json(
            new ApiResponse(200, contest, "Past contest retrieved successfully")
        );
    }
);

export const getContestById = asyncHandler(
    async (req, res) => {
        const { contestId } = req.params;
        const contest = await Contest.findById(contestId);

        if (!contest) {
            throw new ApiError(404, "Contest not found")
        }

        res.status(200).json(
            new ApiResponse(200, contest, " contest details retrieved successfully")
        );
    }
)

export const filterContestsByPlatform = asyncHandler(async (req, res) => {
    const { platforms } = req.params;

    if (!platforms) {
        throw new ApiError(400, "Platforms query parameter is required")
    }

    const platformArray = platforms.split(",");
    const cacheKey = `contests:filter:${platformArray.join(",")}`;
    const cachedContests = await getCachedData(cacheKey);

    if (cachedContests) {
        return res.status(200).json(
            new ApiResponse(200, cachedContests, "Filtered contests retrieved successfully")
        );
    }
    const contests = await Contest.find({
        platform: {
            $in: platformArray
        }
    }).sort({ startTime: 1 });

    await cacheData(cacheKey, contests, 3600);

    res.status(200).json(
        new ApiResponse(200, contests, "Filter contests retrieved successfully")
    );
});


export const addSolutionLink = asyncHandler(
    async (req, res) => {
        const { contestId, solutionLink } = req.body;

        const contest = await Contest.findByIdAndUpdate(
            contestId,
            { solutionVideoId: solutionLink },
            { new: true }
        );

        if (!contest) {
            throw new ApiError(404, "Contest not found")
        }

        res.status(200).json(
            new ApiResponse(
                200,
                contest,
                "Solution link updated successfully"
            )
        );
    });