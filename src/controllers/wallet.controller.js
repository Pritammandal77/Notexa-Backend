import { Transaction } from "../models/transaction.model";
import { Wallet } from "../models/wallet.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const createOrFetchWallet = asyncHandler(async (req, res) => {

    const user = req.user._id

    const isAlreadyWalletExists = await Wallet.findOne({ user: user })

    if (isAlreadyWalletExists) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, isAlreadyWalletExists, "wallet fetch successfully")
            )
    }

    const wallet = await Wallet.create(
        {
            user: user,
            totalEarning: 0,
            availableBalance: 0,
            withdrawnAmount: 0,
            notesSold: []
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, wallet, "wallet created successfully")
        )
})