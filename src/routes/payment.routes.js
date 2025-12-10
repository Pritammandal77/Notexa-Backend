import { Router } from "express";
import { createOrderToBuyNotes, createOrderToUploadNotes, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.route("/create-order-uploadnotes").post(createOrderToUploadNotes)
paymentRouter.route("/verify-payment").post(verifyPayment)
paymentRouter.route("/create-order-buynotes").post(createOrderToBuyNotes)

export default paymentRouter