import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            index: true,
            default: null,
        },
        fullName: {
            type: String,
            required: function () {
                return !this.googleId;
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Google users don't need a password
            },
        },
        refreshToken: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        aboutUser: {
            type: String,
            default: "",
        },
        linkedinLink: {
            type: String,
            trim: true,
            default: "",
        },
        instagramLink: {
            type: String,
            trim: true,
            default: ""
        },
        notesPurchased: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes"
        }]
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema)

