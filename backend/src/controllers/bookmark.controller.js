import Bookmark from "../models/bookmark.model.js";
import Contest from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheData, deleteCachedData, getCachedData } from "../utils/redisClient.js";


export const toggleBookmark = asyncHandler(async (req, res) => {
    const { contestId } = req.body;

    const contest = await Contest.findById(contestId);

    if (!contest) {
        throw new ApiError(404, "Contest not found");
    }

    const existingBookmark = await Bookmark.findOne({
        user: req.user._id,
        contest: contestId,
    })

    if( existingBookmark ){
        await existingBookmark.deleteOne();
        await deleteCachedData(`bookmark:${req.user._id}`);
        return res.status(200).json(
            new ApiResponse(200, null, "Bookmark removed successfully")
        );
    }

    const bookmark = await Bookmark.create({
        user: req.user._id,
        contest: contestId,
    });
    await deleteCachedData(`bookmark:${req.user._id}`);

    res.status(201).json(
        new ApiResponse(201, bookmark, "Bookmark added successfully")
    );
});

export const getUserBookmarks = asyncHandler(async (req, res) => {
    const { page = 1, limit= 10, sort = "createdAt", order = "desc" } = req.query;

    const cacheKey = `bookmark:${req.user._id}`;
    const cachedData = await getCachedData(cacheKey);

    if(cachedData){
        return res.status(200).json(
            new ApiResponse(200, cachedData , "Bookmark retrieved successfully from cache")
        );
    }

    const aggregationPipeline = [
        { $match: { user: req.user._id}},
        {
            $lookup:{
                from: "contests",
                localField: "contest",
                foreignField: "_id",
                as: "contest"
            },
        },
        { $unwind: "$contest" },
        {
            $sort:{
                [sort]: order === "desc" ? -1 : 1
            }
        }
    ];

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    const result = await Bookmark.aggregatePaginate(Bookmark.aggregate(aggregationPipeline), options);

    await cacheData(cacheKey, result, 3600);

    res.status(200).json(
        new ApiResponse(200, result, "Bookmark retrieved successfully")
    );

});

export const getBookmarksForUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const cacheKey = `bookmark:${userId}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
        return res.status(200).json(new ApiResponse(200, cachedData, "Bookmarks retrieved from cache"));
    }

    const aggregationPipeline = [
        { $match: { user: userId } }, 
        {
            $lookup: {
                from: "contests",
                localField: "contest",
                foreignField: "_id",
                as: "contest",
            },
        },
        { $unwind: "$contest" }, 
        {
            $sort: {
                [sort]: order === "desc" ? -1 : 1, 
            },
        },
    ];

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const result = await Bookmark.aggregatePaginate(Bookmark.aggregate(aggregationPipeline), options);

    await cacheData(cacheKey, result, 3600); 

    res.status(200).json(new ApiResponse(200, result, "Bookmarks retrieved successfully"));
});

export const deleteBookmark = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const bookmark = await Bookmark.findOne({
        _id: id,
        user: req.user._id,
    });

    if(!bookmark){
        throw new ApiError(404, "Bookmark not found");
    }

    await bookmark.deleteOne();
    await deleteCachedData(`bookmark:${req.user._id}`);

    res.status(200).json(
        new ApiResponse(200, null, "Bookmark deleted successfully")
    );
});