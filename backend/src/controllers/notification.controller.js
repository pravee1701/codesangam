import {User} from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "../services/notification.service.js";


export const updateNotificationPreference = (isSubscribed) => {
    return asyncHandler(async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { isSubscribedToNotification: isSubscribed},
            { new: true }
        );

        const message = isSubscribed
        ? "You have successfully subscribed to notifications"
        : "You have successfully unsubscribed from notifications";

        res.status(200).json(
            new ApiResponse(200, user, message)
        );
    });
}


export const sendNotificationManually = asyncHandler(async(req, res) => {
    await sendNotification();
    res.status(200).json(
        new ApiResponse(200, null, "Notification sent successfully")
    );
});