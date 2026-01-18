import { Withdraw } from "../models/withdraw.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { Wallet } from "../models/wallet.model";


export const withdrawPayout = asyncHandler(async (req, res) => {
    const { amount, upiId } = req.body;

    const requestedUser = req.user._id;

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Valid amount is required");
    }

    if (!upiId) {
        throw new ApiError(400, "UPI Id is required")
    }

    const MIN_WITHDRAW = 50;

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



