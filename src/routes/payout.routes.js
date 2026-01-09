import { Router } from "express";
import { createNewTransaction } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const payoutRouter = Router();

payoutRouter.route("/create-new-transaction").post(verifyJWT,createNewTransaction)


export default payoutRouter;