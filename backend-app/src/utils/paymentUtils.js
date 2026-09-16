import crypto from "crypto";

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};