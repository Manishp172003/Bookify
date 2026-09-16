import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

export const createRazorpayOrder = async ({
  amount,
  receipt,
}) => {
  const instance = getRazorpayInstance();
  if (instance) {
    return instance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
    });
  }
  return { id: `order_mock_${Date.now()}`, amount: Math.round(amount * 100), currency: "INR" };
};

export default getRazorpayInstance;