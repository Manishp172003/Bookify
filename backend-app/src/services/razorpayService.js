import crypto from "crypto";
import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const isRazorpayConfigured = () => {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET
  );
};

export const createRazorpayOrder = async ({
  amount,
  receipt,
  currency = "INR",
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