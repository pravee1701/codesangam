import Contest from "../models/contest.model.js";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { updateSolutionLinks } from "../services/contest.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheData, getCachedData } from "../utils/redisClient.js";

export const getUpcomingContests = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page <= 0) {
        return res.status(400).json(new ApiResponse(400, null, "Page number must be positive"));
    }
    if (limit <= 0) {
        return res.status(400).json(new ApiResponse(400, null, "Limit must be positive"));
    }

    const cacheKey = `contests:upcoming:page:${page}:limit:${limit}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
        return res.status(200).json(
            new ApiResponse(200, cachedData, "Upcoming contests retrieved successfully from cache")
        );
    }


    const aggregationPipeline = Contest.aggregate([
        {
            $match: { status: "upcoming" }
        },
        {
            $sort: { startTime: 1 }
        }
    ]);

    const options = {
        page: page,
        limit: limit,
        lean: true,
    };

    const result = await Contest.aggregatePaginate(aggregationPipeline, options);

    const responseData = {
        contests: result.docs,
        pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalContests: result.totalDocs,
            limit: result.limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
        }
    };

    await cacheData(cacheKey, responseData, 3600);

    res.status(200).json(
        new ApiResponse(
            200,
            responseData,
            "Upcoming contests retrieved successfully"
        )
    );


});

export const getPastContests = asyncHandler(
    async (req, res) => {

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (page <= 0) {
            throw new ApiError(400, "Page number must be positive")
        }
        if (limit <= 0) {
            throw new ApiError(400, "Limit must be positive")
        }


        const cacheKey = `contests:past:page:${page}:limit:${limit}`;
        const cachedContests = await getCachedData(cacheKey);
        if (cachedContests) {
            return res.status(200).json(
                new ApiResponse(200, cachedContests, "Past contest retrieved successfully")
            );
        }
        

        const aggregationPipeline = Contest.aggregate([
            {
                $match: { status: "past" }
            },
            {
                $sort: { startTime: 1 }
            }
        ]);
    
        const options = {
            page: page,
            limit: limit,
            lean: true,
        };
    
        const result = await Contest.aggregatePaginate(aggregationPipeline, options);
    
        const responseData = {
            contests: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalContests: result.totalDocs,
                limit: result.limit,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
            }
        };
    
        await cacheData(cacheKey, responseData, 3600);

        res.status(200).json(
            new ApiResponse(200, responseData, "Past contest retrieved successfully")
        );
    }
);

export const getContestById = asyncHandler(
    async (req, res) => {
        const { contestId } = req.params;
        const contest = await Contest.findById({ _id: contestId });

        if (!contest) {
            throw new ApiError(404, "Contest not found")
        }

        res.status(200).json(
            new ApiResponse(200, contest, " contest details retrieved successfully")
        );
    }
)

export const filterContestsByPlatform = asyncHandler(async (req, res) => {
    const { platforms } = req.query;
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

export const updateSolutionLinksManually = asyncHandler(async (req, res) => {
    await updateSolutionLinks();
    res.status(200).json(
        new ApiResponse(200, null, "Solution links updated successfully")
    );
});