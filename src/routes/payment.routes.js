import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.route("/create-order").post(createOrder)
paymentRouter.route("/verify-payment").post(verifyPayment)

export default paymentRouter