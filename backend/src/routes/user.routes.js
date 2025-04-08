import express from 'express';
import { userAssignRoleValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from '../validators/user.validator.js';
import { validate } from '../validators/validate.js';
import { assignRole, changeCurrentPassword, forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, resendEmailVerification, resetForgotPassword, verifyEmail } from '../controllers/user.controllers.js';
import { verfiyPermission, verifyJWT } from '../middleware/auth.middleware.js';
import { UserRolesEnum } from '../constants.js';
import { mongoIdPathVariableValidator } from '../common/mongodb.validators.js';

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

router.route("/change-password")
    .post(
        verifyJWT,
        userChangeCurrentPasswordValidator,
        validate,
        changeCurrentPassword
    )

router.route("resend-email-verification")
    .post(
        verifyJWT,
        resendEmailVerification
    );

router.route("/assign-role/:userId")
    .post(
        verifyJWT,
        verfiyPermission([UserRolesEnum.ADMIN]),
        mongoIdPathVariableValidator,
        userAssignRoleValidator,
        validate,
        assignRole
    )