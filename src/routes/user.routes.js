import { Router } from "express";
import { addNoteToPurchased, getPurchasedNotes, getUserById, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const userRouter = Router()

userRouter.route("/add-notes-to-purchased").post(verifyJWT, addNoteToPurchased)

userRouter.route("/purchased-notes").get(verifyJWT, getPurchasedNotes)

userRouter.route("/:id").get(getUserById)

userRouter.route("/update-profile").put(
    verifyJWT,
    upload.single("profilePicture"),
    updateProfile)

export default userRouter 