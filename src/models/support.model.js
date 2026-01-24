import mongoose, { Mongoose, Schema } from "mongoose";

const SupportSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "resolved"],
            default: "open",
        },
    },
    {
        timestamps: true
    }
)


export const Support = mongoose.model("Support", SupportSchema)