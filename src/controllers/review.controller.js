import { Reviews } from "../models/notesReview.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const addNewReview = asyncHandler(async (req, res) => {
    const { rating, review, notesId } = req.body;
    const currUser = req.user._id;

    if (!rating || !review) {
        throw new ApiError(400, "rating & review both are required to add a review")
    }

    if(!currUser){
        throw new ApiError(400, "User not authenticated")
    }

    const addReview = await Reviews.create({
        user: currUser,
        notes: notesId,
        reviewMessage: review,
        rating: rating
    })

    return res.
    status(200)
    .json(
        new ApiResponse(200, addReview, "Review added successfully")
    )

})