import {User} from "../models/user.model.js";
import Contest from "../models/contest.model.js";
import { sendEmail, sendNotificationMailgenContent } from "../utils/mail.js";

export const sendNotification = async () => {
    try {
        const subscribedUsers = await User.find({
            isSubscribedToNotification: true,
        });
        
        if (!subscribedUsers || subscribedUsers.length === 0) {
            console.log("No subscribed users found.");
            return;
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const upcomingContests = await Contest.find({
            startTime: { $gte: tomorrow, $lt: dayAfterTomorrow },
        });

        if (!upcomingContests || upcomingContests.length === 0) {
            console.log("No upcoming contests found for tomorrow.");
            return;
        }

        for (const user of subscribedUsers) {
            try {
                await sendEmail({
                    email: user?.email,
                    subject: "Upcoming Contest Notification",
                    mailgenContent: sendNotificationMailgenContent(
                        user.username,
                        upcomingContests
                    ),
                });
                console.log(`Notification sent to ${user.email}`);
            } catch (error) {
                console.error(`Failed to send notification to ${user.email}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Error in sendNotification:", error.message);
    }
};