import { Router } from "express";
import { changeSupportReqStatus, createSupport, fetchAllSupportRequests } from "../controllers/support.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";


const supportRouter = Router()

supportRouter.route("/need-support").post(verifyJWT, createSupport)
supportRouter.route("/fetch-support-requests").get(verifyJWT, isAdmin, fetchAllSupportRequests)
supportRouter.route("/update-withdraw-req-status").patch(verifyJWT, isAdmin, changeSupportReqStatus)

export default supportRouter