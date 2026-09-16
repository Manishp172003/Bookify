import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async ({
  amount,
  receipt,
}) => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  });
};

export default razorpay;