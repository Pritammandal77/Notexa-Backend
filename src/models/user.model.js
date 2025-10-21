import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        profilePicture: {
            type: String,
        },
        aboutUser: {
            type: String,
            required: true,
            default: ""
        },
        linkedinLink: {
            type: String,
            trim: true,
            default: ""
        },
        githubLink: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("user", userSchema)