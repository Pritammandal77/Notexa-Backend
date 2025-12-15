import { Router } from "express";
import { addNoteToPurchased } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router()

userRouter.route("/add-notes-to-purchased").post(verifyJWT,addNoteToPurchased)

export default userRouter 