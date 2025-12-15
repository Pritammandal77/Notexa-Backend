import { Router } from "express";
import { addNoteToPurchased, getPurchasedNotes } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router()

userRouter.route("/add-notes-to-purchased").post(verifyJWT,addNoteToPurchased)

userRouter.route("/purchased-notes").get(verifyJWT ,getPurchasedNotes)

export default userRouter 