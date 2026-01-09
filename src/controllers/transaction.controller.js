import { Notes } from "../models/notes.model.js";
import { Transaction } from "../models/transaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNewTransaction = asyncHandler(async (req, res) => {
    const { notesId, paymentId } = req.body;

    const buyerId = req.user._id;

    // prevent duplicate transaction
    const existing = await Transaction.findOne({ paymentId });
    if (existing) {
        return res.status(409).json(
            new ApiResponse(409, null, "Transaction already exists")
        );
    }

    const notes = await Notes.findById(notesId);
    if (!notes) {
        return res.status(404).json(
            new ApiResponse(404, null, "Notes not found")
        );
    }

    const amount = notes.price || 29;

    const sellerShare = Math.round(amount * 0.7 * 100) / 100;
    const platformShare = Math.round(amount * 0.3 * 100) / 100;

    const transaction = await Transaction.create({
        notesId,
        notesTitle: notes.title,
        sellerId: notes.seller,
        buyerId,
        amount,
        sellerShare,
        platformShare,
        paymentId
    });

    return res.status(201).json(
        new ApiResponse(201, transaction, "Transaction created successfully")
    );
});
