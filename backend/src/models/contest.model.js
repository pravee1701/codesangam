import mongoose, { Schema } from "mongoose";

const contestSchema = new Schema(
    {
        platform: {
            type: String,
            enum: ["Codeforces", "Codechef", "LeetCode"],
            required: [true, "Platform name is required"]
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "past"],
            required: true,
        },
        solutionVideoId: {
            type: String,
            default: null
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Contest", contestSchema)