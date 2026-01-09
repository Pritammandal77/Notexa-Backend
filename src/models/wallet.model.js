import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        totalEarning: {
            type: Number,
            default: 0
        },
        availableBalance: {
            type: Number,
            default: 0
        },
        withdrawnAmount: {
            type: Number,
            default: 0
        },
        notesSold: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes"
        }]
    },
    {
        timestamps: true
    }
)

export const Wallet = mongoose.model("Wallet", walletSchema)