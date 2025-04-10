import express from "express";
import { verifyJWT, verifyPermission } from "../middleware/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";
import { sendNotificationManually, updateNotificationPreference } from "../controllers/notification.controller.js";



const router = express.Router();

router.route('/subscribe').post(verifyJWT, updateNotificationPreference(true));

router.route('/unsubscribe').post(verifyJWT, updateNotificationPreference(false));

router.route('/send').post(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]),
sendNotificationManually);

export default router;