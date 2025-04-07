import express from 'express';
import { userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from '../validators/user.validator';
import { validate } from '../validators/validate';
import { forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, resetForgotPassword, verifyEmail } from '../controllers/user.controllers';
import { verifyJWT } from '../middleware/auth.middleware';

const router = express.Router();


router.route("/register").post( userRegisterValidator, validate, registerUser);

router.route("/login").post(userLoginValidator, validate, loginUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/forgot-password")
    .post(userForgotPasswordValidator, validate, forgotPassword);

router.route("/reset-password/:resetToken")
    .post(userResetForgottenPasswordValidator,validate, resetForgotPassword);

// Secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-useer").get(verifyJWT, getCurrentUser);