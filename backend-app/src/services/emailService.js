/**
 * Email Service with Brevo API integration and HTML Transactional Email Templates.
 * Provides fallback console logging when API keys are not configured.
 */

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@bookify.com";
    const senderName = process.env.BREVO_SENDER_NAME || "Bookify";

    if (!apiKey) {
      console.log(`[Email Dev Mode] To: ${to} | Subject: "${subject}"`);
      return { success: true, mode: "dev_fallback" };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Brevo email sending failed");
    }

    return data;
  } catch (error) {
    console.error("Email error:", error.message);
    // Don't crash caller if email fails in background
    return { success: false, error: error.message };
  }
};

// ─── Transactional Email Templates ───────────────────────────────────────────

/**
 * 1. OTP Verification Email Template
 */
export const sendOtpEmail = async (email, otp, name = "Bookify Member") => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #F8F7FF; border-radius: 16px; border: 1px solid #E7E4F2;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6C4BF4; margin: 0; font-size: 28px; font-weight: 800;">Bookify</h1>
        <p style="color: #6B6880; font-size: 14px; margin-top: 4px;">Smart Campus Book Marketplace & Author Studio</p>
      </div>
      <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(108, 75, 244, 0.05);">
        <h2 style="color: #17152A; font-size: 20px; margin-top: 0;">Verify Your Account</h2>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">Use the verification code below to complete your authentication request:</p>
        <div style="background-color: #EEEAFE; text-align: center; padding: 18px; border-radius: 10px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #6C4BF4;">${otp}</span>
        </div>
        <p style="color: #8C89A0; font-size: 13px; line-height: 1.5;">This code is valid for <strong>10 minutes</strong>. If you did not request this verification, you can safely ignore this email.</p>
      </div>
      <p style="text-align: center; color: #A09DB5; font-size: 12px; margin-top: 24px;">&copy; ${new Date().getFullYear()} Bookify. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Your Bookify Verification Code: ${otp}`,
    htmlContent,
  });
};

/**
 * 2. Password Reset Email Template
 */
export const sendPasswordResetEmail = async (email, resetToken, name = "Bookify Member") => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #F8F7FF; border-radius: 16px; border: 1px solid #E7E4F2;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6C4BF4; margin: 0; font-size: 28px; font-weight: 800;">Bookify</h1>
      </div>
      <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(108, 75, 244, 0.05);">
        <h2 style="color: #17152A; font-size: 20px; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetLink}" style="background-color: #6C4BF4; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-size: 15px; font-weight: 700; border-radius: 10px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #8C89A0; font-size: 13px; line-height: 1.5;">This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, no action is needed.</p>
        <p style="color: #8C89A0; font-size: 12px; word-break: break-all; margin-top: 20px;">Or copy and paste this link: <br/><a href="${resetLink}" style="color: #6C4BF4;">${resetLink}</a></p>
      </div>
      <p style="text-align: center; color: #A09DB5; font-size: 12px; margin-top: 24px;">&copy; ${new Date().getFullYear()} Bookify. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Bookify Password",
    htmlContent,
  });
};

/**
 * 3. Order Receipt Email Template
 */
export const sendOrderReceiptEmail = async (email, order, name = "Valued Customer") => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #F0EEF8;">
        <td style="padding: 12px 0; color: #17152A; font-weight: 600;">${item.title} <span style="font-size: 12px; color: #8C89A0; font-weight: 400;">(${item.condition})</span></td>
        <td style="padding: 12px 0; text-align: center; color: #4A4668;">x${item.quantity || 1}</td>
        <td style="padding: 12px 0; text-align: right; color: #17152A; font-weight: 700;">₹${item.price}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #F8F7FF; border-radius: 16px; border: 1px solid #E7E4F2;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6C4BF4; margin: 0; font-size: 28px; font-weight: 800;">Bookify</h1>
        <p style="color: #22C55E; font-weight: 700; font-size: 14px; margin-top: 4px;">✓ Order Confirmed & Paid</p>
      </div>
      <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(108, 75, 244, 0.05);">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F0EEF8; padding-bottom: 14px; margin-bottom: 18px;">
          <div>
            <p style="margin: 0; font-size: 13px; color: #8C89A0;">Order ID</p>
            <p style="margin: 2px 0 0 0; font-weight: 700; color: #17152A;">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 13px; color: #8C89A0;">Date</p>
            <p style="margin: 2px 0 0 0; font-weight: 600; color: #4A4668;">${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <p style="color: #4A4668; font-size: 15px;">Hello <strong>${name}</strong>, thank you for your order! Your escrow payment is safely held until delivery.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #EEEAFE; text-align: left; font-size: 12px; text-transform: uppercase; color: #8C89A0;">
              <th style="padding-bottom: 8px;">Book</th>
              <th style="padding-bottom: 8px; text-align: center;">Qty</th>
              <th style="padding-bottom: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml || `<tr><td colspan="3" style="padding: 10px 0;">Standard Book Purchase</td></tr>`}
          </tbody>
        </table>

        <div style="background-color: #F8F7FF; padding: 16px; border-radius: 8px; margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #4A4668;">
            <span>Subtotal</span>
            <span>₹${order.subtotal || order.amount}</span>
          </div>
          ${order.deliveryFee ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #4A4668;"><span>Delivery</span><span>₹${order.deliveryFee}</span></div>` : ""}
          ${order.discount ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #22C55E;"><span>Discount</span><span>-₹${order.discount}</span></div>` : ""}
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 16px; color: #17152A; border-top: 1px solid #E7E4F2; padding-top: 8px; margin-top: 8px;">
            <span>Total Paid</span>
            <span style="color: #6C4BF4;">₹${order.amount}</span>
          </div>
        </div>
      </div>
      <p style="text-align: center; color: #A09DB5; font-size: 12px; margin-top: 24px;">&copy; ${new Date().getFullYear()} Bookify. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Order Receipt: #${order._id.toString().slice(-8).toUpperCase()} - Bookify`,
    htmlContent,
  });
};

/**
 * 4. Author Verification Status Email Template
 */
export const sendVerificationStatusEmail = async (email, status, name = "Author", reviewNote = "") => {
  const isApproved = status === "verified";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #F8F7FF; border-radius: 16px; border: 1px solid #E7E4F2;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #6C4BF4; margin: 0; font-size: 28px; font-weight: 800;">Bookify</h1>
      </div>
      <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(108, 75, 244, 0.05);">
        <h2 style="color: ${isApproved ? "#22C55E" : "#EF4444"}; font-size: 20px; margin-top: 0;">
          ${isApproved ? "✓ Author Verification Approved!" : "Author Verification Update"}
        </h2>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #4A4668; font-size: 15px; line-height: 1.6;">
          ${
            isApproved
              ? "Congratulations! Your credentials and author verification documents have been verified by the Bookify administration team. You now have full access to Author Studio tools, publishing features, and coupon creation."
              : "Thank you for submitting your verification documents. After review by our administration team, your author application could not be approved at this time."
          }
        </p>
        ${
          reviewNote
            ? `<div style="background-color: #FFF7ED; border-left: 4px solid #F97316; padding: 12px 16px; border-radius: 4px; margin: 18px 0; font-size: 14px; color: #9A3412;">
                 <strong>Review Note:</strong> ${reviewNote}
               </div>`
            : ""
        }
        <p style="color: #8C89A0; font-size: 13px; line-height: 1.5; margin-top: 20px;">
          ${
            isApproved
              ? "You can now log in to the Author Studio and begin publishing."
              : "You can update your credentials or documents in your Profile Settings and resubmit for verification at any time."
          }
        </p>
      </div>
      <p style="text-align: center; color: #A09DB5; font-size: 12px; margin-top: 24px;">&copy; ${new Date().getFullYear()} Bookify. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Author Verification Status: ${isApproved ? "Approved" : "Action Required"} - Bookify`,
    htmlContent,
  });
};

export default {
  sendEmail,
  sendOtpEmail,
  sendPasswordResetEmail,
  sendOrderReceiptEmail,
  sendVerificationStatusEmail,
};