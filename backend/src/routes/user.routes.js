import express from 'express';
import passport from "passport";
import "../passport/indes.js";
import { userAssignRoleValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from '../validators/user.validator.js';
import { validate } from '../validators/validate.js';
import { assignRole, changeCurrentPassword, forgotPassword, getCurrentUser, handleSocialLogin, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from '../controllers/user.controllers.js';
import { verifyPermission, verifyJWT } from '../middleware/auth.middleware.js';
import { UserRolesEnum } from '../constants.js';
import { mongoIdPathVariableValidator } from '../common/mongodb.validators.js';

const router = express.Router();


router.route("/register").post(userRegisterValidator, validate, registerUser);

router.route("/login").post(userLoginValidator, validate, loginUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/forgot-password")
    .post(userForgotPasswordValidator, validate, forgotPassword);

router.route("/reset-password/:resetToken")
    .post(userResetForgottenPasswordValidator, validate, resetForgotPassword);

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

router.route("/assign-role/:userId").post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]), 
    mongoIdPathVariableValidator("userId"),
    userAssignRoleValidator,
    validate,
    assignRole
);

// SSO routes

router.route("/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to google...");
    }
);
router.route("/github").get(
    passport.authenticate("github/github", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to github/github...");
    }
);

router.route("/google/callback")
    .get(passport.authenticate("google"),
    handleSocialLogin)

router.route("/github/callback")
    .get(passport.authenticate("github"),
    handleSocialLogin)

export default router;