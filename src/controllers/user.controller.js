import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getHello = async (req, res) => {
    return res
        .json(
            "User registered & logged in successfully"
        );
}


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

export { getHello }                                                                                                                                                                         