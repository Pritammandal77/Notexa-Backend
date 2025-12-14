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
        subject: {
            type: String,
            trim: true
        },
        className: {
            type: String,
            trim: true
        },
        pagesCount: {
            type: Number,
            required: true
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        totalDownloads: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        category: {
            type: String,
            trim: true
        },
        notesUrl: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            enum: [29, 39, 49],
            default: 29,
            required: true
        },
        notesSample1: {
            type: String,
            required: true
        },
        notesSample2: {
            type: String,
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews"
        }]
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema)