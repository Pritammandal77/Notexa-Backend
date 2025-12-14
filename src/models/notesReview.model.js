import mongoose, { Schema } from "mongoose";

const notesReviewSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes",
            required: true,
        },
        reviewMessage: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Reviews = mongoose.model("Reviews", notesReviewSchema)