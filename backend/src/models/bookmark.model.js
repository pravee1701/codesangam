import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookmarkSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        contest: {
            type: Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
        },
    }, {
        timestamps: true,
    }
);

bookmarkSchema.plugin(aggregatePaginate);

export default mongoose.model("Bookmark", bookmarkSchema);