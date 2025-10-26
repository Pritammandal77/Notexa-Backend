import { Router } from "express";
import { getHello } from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.route("/register").get(getHello)

export default userRouter