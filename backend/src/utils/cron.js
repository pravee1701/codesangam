import cron from "node-cron";
import { fetchContestsFromAPIs } from "../services/contest.service.js";
import { sendNotification } from "../services/notification.service.js";


cron.schedule("0 */6 * * *", async () => {
    console.log("Fetching contests from external APIs");
    await fetchContestsFromAPIs();
    console.log("Contests fetched successfully");
});

cron.schedule("0 9 * * *", async () => {
    console.log("Running scheduled notification job ...");
    try {
        await sendNotification();
        console.log("Notification sent successfully");
    } catch (error) {
        console.error("Error sending notifications:", error.message);
    }
})