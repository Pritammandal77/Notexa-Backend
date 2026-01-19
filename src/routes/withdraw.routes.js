import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllWithDrawRequest, getCurrUserWithdrawReq, processWithDrawRequests, withdrawPayout } from "../controllers/withdraw.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";


const withdrawRouter = Router()

withdrawRouter.route("/request-withdraw").post(verifyJWT, withdrawPayout)

withdrawRouter.route("/all-withdraw-requests").get(verifyJWT, isAdmin, getAllWithDrawRequest)

withdrawRouter.route("/update-withdraw-req-status").put(isAdmin, processWithDrawRequests)

withdrawRouter.route("/curr-user/withdraw-requests").get(verifyJWT, getCurrUserWithdrawReq)

export default withdrawRouter