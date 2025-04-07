import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler} from "../middleware/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError";
import { UserRolesEnum } from "../constants";

export const registerUser = asyncHandler(async(req, res) => {
    const { username, email, password, role } = req.body;

    const existedUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists", []);
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
        role: role || UserRolesEnum.USER,
    });

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent:
        emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if(!createdUser){
        throw new ApiError(500, "Somethng went wrong while registering user");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            {
                user: createdUser
            },
            "User registered successfully and verification email has been sent on your email. "
        )
    );
});