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
  if (!isRazorpayConfigured()) {
    throw new Error(
      "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env"
    );
  }

  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    throw new Error("Razorpay configuration is invalid");
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid Razorpay amount");
  }

  const amountInPaise = Math.round(numericAmount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt: String(receipt),
  });

  return order;
};

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};