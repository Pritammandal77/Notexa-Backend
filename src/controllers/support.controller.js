import { Support } from "../models/support.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"

export const createSupport = asyncHandler(async (req, res) => {
    const { fullName, email, subject, message } = req.body

    if (!fullName || !email || !subject || !message) {
        throw new ApiError(400, "All fields are required")
    }

    const support = await Support.create(
        {
            user: req.user?._id || null,
            fullName,
            email,
            subject,
            message
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Support request submitted successfully")
        )
})


export const fetchAllSupportRequests = asyncHandler(async (req, res) => {
    const supports = await Support.find({})
        .populate("user", "fullName email profilePicture")
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(200, supports, "Fetched all support requests successfully")
        )
})