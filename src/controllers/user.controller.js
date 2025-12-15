import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addNoteToPurchased = asyncHandler(async (req, res) => {
    const { notesId } = req.body
    const currUser = req.user._id

    if (!notesId) {
        throw new ApiError(400, "Couldn't get the notes ID")
    }

    const updateUserNotesPurchased = await User.findByIdAndUpdate(
        currUser,
        {
            $addToSet: { notesPurchased: notesId }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updateUserNotesPurchased, "Notes added successfully")
        )
})

export const getPurchasedNotes = asyncHandler(async (req, res) => {
    const currUser = req.user._id;

    const downloadedNotes = await User.findById(currUser)
        .populate("notesPurchased", "_id title notesSample1 price category subject")
        .select("notesPurchased");

    return res
        .status(200)
        .json(
            new ApiResponse(200, downloadedNotes, "Downloaded notes fetched successfully")
        )
})