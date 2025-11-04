import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
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
        notesUrl: {
            type: String,
            required: true
        },
        notesSamples: {
            type: [String],
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
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema)