import cron from "node-cron";
import { fetchContestsFromAPIs } from "../services/contest.service.js";


cron.schedule("0 */6 * * *", async () => {
    console.log("Fetching contests from external APIs");
    await fetchContestsFromAPIs();
    console.log("Contests fetched successfully");
})