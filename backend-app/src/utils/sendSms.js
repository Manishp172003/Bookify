import twilio from "twilio";

/**
 * Dispatches an SMS verification OTP via Fast2SMS (India) or Twilio (Global).
 * If credentials are not configured, logs to console in development mode.
 */
export const sendOTP = async (phone, otp) => {
  try {
    const cleanPhone = String(phone).replace(/\D/g, ""); // digits only

    // 1. Try Fast2SMS Gateway (India numbers, 10 digits)
    const { FAST2SMS_API_KEY } = process.env;
    if (FAST2SMS_API_KEY && cleanPhone.length >= 10) {
      const nationalNumber = cleanPhone.slice(-10);
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: nationalNumber,
        }),
      });

      const data = await response.json();
      if (data.return) {
        console.log(`[Fast2SMS Gateway] OTP sent to +91 ${nationalNumber}`);
        return true;
      } else {
        console.warn("[Fast2SMS Error]", data.message);
      }
    }

    // 2. Try Twilio Gateway (E.164 formatted international/India numbers)
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const recipientNumber = phone.startsWith("+") ? phone : `+91${cleanPhone.slice(-10)}`;

      await client.messages.create({
        body: `Your Bookify verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: TWILIO_PHONE_NUMBER,
        to: recipientNumber,
      });

      console.log(`[Twilio Gateway] OTP dispatched to ${recipientNumber}`);
      return true;
    }

    // 3. Fallback Development Simulation Mode
    console.log(`\n=========================================`);
    console.log(`📱 [SMS Gateway Simulation]`);
    console.log(`Recipient: ${phone}`);
    console.log(`Message: Your Bookify verification code is: ${otp}`);
    console.log(`=========================================\n`);
    return true;
  } catch (error) {
    console.error("[SMS Gateway Error]:", error.message);
    return false;
  }
};

export default sendOTP;