import { sendEmail } from "./emailService.js";

export const sendOrderConfirmationEmail = async ({
  email,
  name,
  orderId,
  amount,
}) => {
  return sendEmail({
    to: email,
    subject: "Bookify - Order Confirmation",
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Bookify Order Confirmation</h2>

        <p>Hello ${name},</p>

        <p>Your order has been placed successfully.</p>

        <p>
          <strong>Order ID:</strong> ${orderId}
        </p>

        <p>
          <strong>Amount:</strong> ₹${amount}
        </p>

        <p>Thank you for using Bookify.</p>
      </div>
    `,
  });
};