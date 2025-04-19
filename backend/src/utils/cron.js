import cron from "node-cron";
import { fetchContestsFromAPIs, updateSolutionLinks } from "../services/contest.service.js";
import { sendNotification } from "../services/notification.service.js";
import contestModel from "../models/contest.model.js";


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

cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled job to update solution links...");
    try {
        await updateSolutionLinks();
        console.log("Solution links updated successfully.");
    } catch (error) {
        console.error("Error updating solution links:", error.message);
    }
});

cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      await contestModel.updateMany(
        { endTime: { $lt: now }, status: 'upcoming' },
        { $set: { status: 'past' } }
      );
  
      console.log('Checked and updated store statuses:', now.toISOString());
    } catch (error) {
      console.error('Error updating store statuses:', error);
    }
  });