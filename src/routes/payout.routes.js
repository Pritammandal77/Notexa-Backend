import { Router } from "express";
import { createNewTransaction } from "../controllers/transaction.controller";


const payoutRouter = Router();

payoutRouter.route("/create-new-transaction").post(createNewTransaction)


export default payoutRouter;