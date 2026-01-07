import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        notesTitle: {
            type: String
        },
        notesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notes'
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        BuyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number
        },
        sellerShare: {
            type: Number,
            required: true
        },
        platformShare: {
            type: Number
        },
        paymentId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Transaction = mongoose.model("Transaction", transactionSchema)