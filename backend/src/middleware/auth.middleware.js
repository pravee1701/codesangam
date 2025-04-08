import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.split(" ")[1];

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized request"
        )
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )

        if(!user){
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            401, 
            error?.message || "Invalid access token"
        );
    }
});

export const verfiyPermission = (roles = []) => {
    asyncHandler(async (req, res) => {
        if(!req.user?._id){
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        if(roles.includes(req.user?.role)){
            next();
        } else {
            throw new ApiError(
                403,
                "You are not allowed to perform this action"
            )
        }
    });
}