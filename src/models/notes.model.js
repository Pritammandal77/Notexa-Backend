import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema(
    {
        notesUrl: {
            type: String,
            required: true
        },
        thumbNailUrl : {
            type : String,
            required: true
        },
        pagesCount : {
            type : Number
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        // seller IDs
        // buyer IDs
        // rating
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema)