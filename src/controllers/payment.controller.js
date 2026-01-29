import crypto from "crypto";
import { razorpayInstance } from "../utils/razorpay.js";
import { User } from "../models/user.model.js";

export const createOrderToUploadNotes = async (req, res) => {
    try {
        const { userId } = req.body;

        const options = {
            amount: 9 * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
    
        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};


export const createOrderToBuyNotes = async (req, res) => {
    try {
        const { userId } = req.body;

        const options = {
            amount: 29 * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // upload permission store in DB
        await User.findByIdAndUpdate(userId, {
            canUploadNotes: true,
            paymentId: razorpay_payment_id
        });
   
        res.status(200).json({ success: true, message: "Payment verified" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

