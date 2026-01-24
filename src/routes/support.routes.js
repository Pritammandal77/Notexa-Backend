import { Router } from "express";
import { createSupport, fetchAllSupportRequests } from "../controllers/support.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const supportRouter = Router()

supportRouter.route("/need-support").post(verifyJWT, createSupport)
supportRouter.route("/fetch-support-requests").get(fetchAllSupportRequests)

export default supportRouter