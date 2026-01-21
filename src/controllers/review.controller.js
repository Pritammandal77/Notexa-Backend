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

    if (!currUser) {
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


export const fetchAllReviewsById = asyncHandler(async (req, res) => {
    const notesId = req.params.id

    if (!notesId) {
        throw new ApiError(400, "NotesId not found")
    }

    const reviews = await Reviews.find({ notes: notesId })
        .populate("user", "fullName email profilePicture")
        .sort({ createdAt: -1 })

    return res.status(200)
        .json(
            new ApiResponse(200, reviews, "Reviews fetched successfully")
        )
})


export const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError("review Id is required to delete review")
    }

    await Reviews.findByIdAndDelete(id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Review deleted successfully")
        )
})