import Contest from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUpcomingContests = asyncHandler(async (req, res) => {
    const now = new Date();
    const contest = await Contest.find({status: "upcoming"}).sort({startTime: 1});
    
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
        const contest = await Contest.find({ status: "past"}).sort({ endTime: -1});

        res.status(200).json(
            new ApiResponse(200, contest, "Past contest retrieved successfully")
        );
    }
);

export const getContestById = asyncHandler(
    async (req, res) => {
        const { contestId } = req.params;
        const contest = await Contest.findById(contestId);

        if(!contest){
            throw new ApiError(404, "Contest not found")
        }

        res.status(200).json(
            new ApiResponse(200, contest, " contest details retrieved successfully")
        );
    }
)

export const filterContestsByPlatform = asyncHandler( async (req, res) =>{
    const { platforms } = req.params;

    if(!platforms){
        throw new ApiError(400, "Platforms query parameter is required")
    }

    const plateformArray = platforms.split(",");
    const contests = await Contest.find({platform: {
        $in: plateformArray
    }}).sort({startTime: 1});

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

        if(!contest){
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