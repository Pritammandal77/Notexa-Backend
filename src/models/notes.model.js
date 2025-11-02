import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema(
    {
        notesUrl: {
            type: String,
            required: true
        },
        thumbNailUrl: {
            type: String,
            required: true
        },
        pagesCount: {
            type: Number
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        totalDownloads: {
            type: Number,
            default: 0
        }
        // buyer IDs
        // rating
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema)