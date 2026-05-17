import razorpay from "razorpay";
import { config } from "../config/config.js";

const razorPay = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const createOrder = async ({ amount, currency }) => {
    const options = {
        amount : amount * 100,
        currency ,
    }

    const order = await razorPay.orders.create(options);
    return order;
}