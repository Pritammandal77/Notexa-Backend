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
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number,
            default : 29
        }, 
        sellerShare: {
            type: Number,
            required: true
        },
        platformShare: {
            type: Number
        },
        paymentId: {
            type: String,
            unique : true
        }
    },
    {
        timestamps: true
    }
)

export const Transaction = mongoose.model("Transaction", transactionSchema)