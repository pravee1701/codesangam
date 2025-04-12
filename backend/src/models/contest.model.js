import mongoose, { Schema } from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
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
            index: true
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

contestSchema.plugin(aggregatePaginate);

contestSchema.index({ startTime: 1 });

export default mongoose.model("Contest", contestSchema)