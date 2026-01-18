import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { withdrawPayout } from "../controllers/withdraw.controller";


const withdrawRouter = Router()

withdrawRouter.route("/request-withdraw").post(verifyJWT, withdrawPayout)

export default withdrawRouter