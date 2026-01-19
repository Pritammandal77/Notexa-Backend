import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Wallet } from "../models/wallet.model.js";
import { Withdraw } from "../models/withdraw.model.js"

export const withdrawPayout = asyncHandler(async (req, res) => {
    const { amount, upiId } = req.body;

    const requestedUser = req.user._id;

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Valid amount is required");
    }

    if (!upiId) {
        throw new ApiError(400, "UPI Id is required")
    }

    const MIN_WITHDRAW = 10;

    if (amount < MIN_WITHDRAW) {
        throw new ApiError(400, `Minimum withdraw amount is ₹${MIN_WITHDRAW}`);
    }

    const wallet = await Wallet.findOne({ user: requestedUser });

    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }


    if (wallet.availableBalance < amount) {
        throw new ApiError(400, "Your available balance is not sufficient");
    }

    const withdraw = await Withdraw.create(
        {
            amount,
            upiId,
            requestedUser,
        }
    )

    // update seller wallet
    await Wallet.findOneAndUpdate(
        { user: requestedUser },
        {
            $inc: {
                availableBalance: -amount,
                withdrawnAmount: amount
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "requested for withdraw money successfull")
        )
})


export const getAllWithDrawRequest = asyncHandler(async (req, res) => {
    const withDrawRequests = await Withdraw.find({})
        .populate({
            path: "requestedUser",
            select: "fullName email profilePicture"
        })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(200, withDrawRequests, "All withdraw requests fetched successfully")
        )
})


export const processWithDrawRequests = asyncHandler(async (req, res) => {
    const { status, withdrawId } = req.body;

    const allowedStatus = ["pending", "processing", "rejected", "fulfilled"];
    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid withdraw status");
    }

    const updatedWithdrawReq = await Withdraw.findByIdAndUpdate(
        withdrawId,
        { $set: { status } },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Withdraw request status updated successfully")
        )
})


export const getCurrUserWithdrawReq = asyncHandler(async (req, res) => {
    const user = req.user._id

    const withdrawRequests = await Withdraw.find({ requestedUser: user }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, withdrawRequests, "Withdraw requests fetched successfully")
        )
})
