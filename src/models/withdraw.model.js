import mongoose, { Mongoose, Schema } from "mongoose";


const withdrawSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        upiId: {
            type: String,
            required: true
        },
        requestedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "processing", "fulfilled"],
            default: "pending"
        }
    },
    {
        timestamps : true
    }
)

export const Withdraw = mongoose.model("Withdraw", withdrawSchema)