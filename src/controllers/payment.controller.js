// import crypto from "crypto";
// import { razorpayInstance } from "../utils/razorpay.js";
// import { User } from "../models/user.model.js";

// export const createOrderToUploadNotes = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const options = {
//             amount: 9 * 100,
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpayInstance.orders.create(options);

//         res.status(200).json({
//             success: true,
//             order,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Order creation failed" });
//     }
// };


// export const createOrderToBuyNotes = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const options = {
//             amount: 29 * 100,
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpayInstance.orders.create(options);

//         res.status(200).json({
//             success: true,
//             order,
//         });

//     } catch (error) {
//         // console.log(error);
//         res.status(500).json({ success: false, message: "Order creation failed" });
//     }
// };


// export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

//         const sign = razorpay_order_id + "|" + razorpay_payment_id;

//         const expectedSign = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(sign)
//             .digest("hex");

//         if (razorpay_signature !== expectedSign) {
//             return res.status(400).json({ success: false, message: "Invalid signature" });
//         }

//         // IMPORTANT: upload permission store in DB
//         await User.findByIdAndUpdate(userId, {
//             canUploadNotes: true,
//             paymentId: razorpay_payment_id
//         });

//         res.status(200).json({ success: true, message: "Payment verified" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Payment verification failed" });
//     }
// };


import crypto from "crypto";
import { getRazorpayInstance } from "../utils/razorpay.js";
import { User } from "../models/user.model.js";


export const createOrderToUploadNotes = async (req, res) => {
    try {
        const razorpay = getRazorpayInstance();

        const options = {
            amount: 9 * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-8)}`
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Razorpay order error:", error);
        return res.status(500).json({
            success: false,
            message: "Order creation failed"
        });
    }
};


/* CREATE ORDER – BUY NOTES */
export const createOrderToBuyNotes = async (req, res) => {
    try {
        const { userId } = req.body;

        const razorpay = getRazorpayInstance();

        const options = {
            amount: 29 * 100, // ₹29 → paise
            currency: "INR",
            receipt: `buy_${userId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Razorpay order error:", error);
        return res.status(500).json({
            success: false,
            message: "Order creation failed",
        });
    }
};


/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
        } = req.body;

        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        await User.findByIdAndUpdate(userId, {
            canUploadNotes: true,
            paymentId: razorpay_payment_id,
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};


