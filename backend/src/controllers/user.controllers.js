import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UserLoginType, UserRolesEnum } from "../constants.js";
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false,
        });

        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access token"
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const existedUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if (existedUser) {
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

    await user.save({ validateBeforeSave: false });

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

    if (!createdUser) {
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

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    if (user.loginType !== UserLoginType.EMAIL_PASSWORD) {
        throw new ApiError(400, "You have previously registered using " + user.loginType + " login type. Please use that to login");
    };

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token",
        )
    }
})

export const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
        throw new ApiError(
            400,
            "Email verification token is required"
        );
    }

    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {
            $gt: Date.now(),
        },
    });

    if (!user) {
        throw new ApiError(
            489,
            "Token is invalid or expired"
        );
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    user.isEmailVerified = true;

    await user.save({
        validateBeforeSave: false,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "Email verified successfully"
            )
        );
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(
            404,
            "User does not exist"
        );
    }
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;

    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgenContent:
            forgotPasswordMailgenContent(
                user.username,
                `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
            )
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset mail has been sent on your mail id"
            )
        );

});

export const resetForgotPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: {
            $gt: Date.now(),
        },
    });

    if(!user){
        throw new ApiError(
            404,
            "Token is invalid or expired"
        );
    }

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.password = newPassword;

    await user.save({
        validateBeforeSave: false,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: '',
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out"
            )
        );
});

export const getCurrentUser = asyncHandler(async (req, res) =>{
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(
            400,
            "Invalid old password"
        );
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password changed successfully"
        ));

});

export const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(
            404, 
            "User does not exist",
            []
        );
    }

    if(user.isEmailVerified){
        throw new ApiError(
            409,
            "Email is already verified"
        );
    }

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

    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Email verification link sent successfully"
    ));
});

export const assignRole = asyncHandler(async(req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(
            404,
            "User does not exist"
        );
    }

    user.role = role;
    await user.save({validateBeforeSave: false});
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Role changed for the user"
            )
        );
});

export const handleSocialLogin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res  
        .status(301)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .redirect(`${process.env.CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`

        );
});