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

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const user = await User.findById(id, "-googleId -notesPurchased")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "user fetched successfully")
        )
})


import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, aboutUser, linkedinLink, instagramLink } = req.body;
    const id = req.user._id;

    let profilePicture;

    if (req.file) {
        const cloudinaryRes = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryRes) {
            return res.status(500).json(
                new ApiResponse(500, null, "Profile image upload failed")
            );
        }

        profilePicture = cloudinaryRes.url;
    }

    const updatedProfile = await User.findByIdAndUpdate(
        id,
        {
            fullName,
            aboutUser,
            linkedinLink,
            instagramLink,
            ...(profilePicture && { profilePicture }),
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedProfile, "Profile updated successfully")
    );
});

