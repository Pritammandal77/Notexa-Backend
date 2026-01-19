import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { withdrawPayout } from "../controllers/withdraw.controller.js";


const withdrawRouter = Router()

withdrawRouter.route("/request-withdraw").post(verifyJWT, withdrawPayout)

export default withdrawRouter