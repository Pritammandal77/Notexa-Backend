// import { Notes } from "../models/notes.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const uploadNotes = asyncHandler(async (req, res) => {
//     const { title, description, subject = "", className = "", pagesCount, price } = req.body
//     const userId = req.user._id

//     const notesLocalPath = req.files?.notes?.[0]?.path;
//     const notesSample1LocalPath = req.files?.sample1?.[0]?.path;
//     const notesSample2LocalPath = req.files?.sample2?.[0]?.path;

//     let notesUrl = { url: "" };
//     let sample1Url = { url: "" };
//     let sample2Url = { url: "" };

//     // Upload image if available
//     if (notesLocalPath) {
//         notesUrl = await uploadOnCloudinary(notesLocalPath);
//         if (!notesUrl?.url) throw new ApiError(400, "Error while uploading notes");
//     }

//     // Upload image if available
//     if (notesSample1LocalPath) {
//         sample1Url = await uploadOnCloudinary(notesSample1LocalPath);
//         if (!sample1Url?.url) throw new ApiError(400, "Error while uploading sample 1");
//     }
//     // Upload image if available
//     if (notesSample2LocalPath) {
//         sample2Url = await uploadOnCloudinary(notesSample2LocalPath);
//         if (!sample2Url?.url) throw new ApiError(400, "Error while uploading sample 2");
//     }

//     const newNotes = await Notes.create(
//         {
//             title,
//             description,
//             subject,
//             className: className,
//             pagesCount,
//             viewsCount: 0,
//             totalDownloads: 0,
//             notesSample1: sample1Url.url,
//             notesSample2: sample2Url.url,
//             notesUrl: notesUrl.url,
//             price,
//             seller: userId
//         }
//     )

//     return res
//         .status(201)
//         .json(
//             new ApiResponse(201, { newNotes }, "Notes uploaded successfully")
//         );

// })

// export {
//     uploadNotes
// }


import { Notes } from "../models/notes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const uploadNotes = asyncHandler(async (req, res) => {
    const { title, description, subject = "", className = "", pagesCount, price } = req.body;
    const userId = req.user._id;

    // Match frontend names
    const notesLocalPath = req.files?.notesFile?.[0]?.path;
    const sampleLocalPaths = req.files?.samples || [];

    let notesUrl = { url: "" };
    let sampleUrls = [];

    // Upload main notes file
    if (notesLocalPath) {
        notesUrl = await uploadOnCloudinary(notesLocalPath);
        if (!notesUrl?.url) throw new ApiError(400, "Error while uploading notes");
    }

    // Upload sample images
    for (const file of sampleLocalPaths) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.url) sampleUrls.push(uploaded.url);
    }

    // Ensure at least one file exists
    if (!notesUrl.url) throw new ApiError(400, "Notes file is required");

    // Create Notes in DB
    const newNotes = await Notes.create({
        title,
        description,
        subject,
        className,
        pagesCount,
        viewsCount: 0,
        totalDownloads: 0,
        notesSample1: sampleUrls[0] || "",
        notesSample2: sampleUrls[1] || "",
        notesUrl: notesUrl.url,
        price,
        seller: userId,
    });

    return res.status(201).json(
        new ApiResponse(201, { newNotes }, "Notes uploaded successfully")
    );
});


export const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Notes.find({})
        .sort({ createdAt: -1 })
        .populate({
            path: "seller",
            select: "fullName email profilePicture"
        });

    if (!notes || notes.length === 0) {
        throw new ApiError(404, "No notes found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "All notes fetched successfully"));
});
