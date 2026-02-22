import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fetchAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .sort({ createdAt: -1 })
   
    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "All users fetched successfully")
        )
})

