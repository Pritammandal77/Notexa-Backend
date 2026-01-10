import { Router } from "express";
import { createNewTransaction } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrFetchWallet } from "../controllers/wallet.controller.js";


const payoutRouter = Router();

payoutRouter.route("/create-new-transaction").post(verifyJWT,createNewTransaction)

payoutRouter.route("/create-or-fetch-wallet").get(verifyJWT, createOrFetchWallet)

export default payoutRouter;