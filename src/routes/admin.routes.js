import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchAllUser } from "../controllers/admin.controller.js";


const adminRouter = Router()

adminRouter.route("/all-users").get(verifyJWT, isAdmin, fetchAllUser)


export default adminRouter