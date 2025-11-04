import mongoose, { Schema } from "mongoose";


const notesReviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : true
        },
        note: {
            type: Schema.Types.ObjectId,
            ref: "Notes",
            required: true,
        },
        reviewMessage: {
            type: String,
            required: true,
            trim: true,
        },
        stars: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Reviews = mongoose.model("Reviews", notesReviewSchema)