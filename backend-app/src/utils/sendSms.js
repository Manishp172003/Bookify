import twilio from "twilio";

/**
 * Dispatches an SMS verification OTP via Twilio.
 * If credentials are not supplied, falls back to logging the OTP to console.
 */
export const sendOTP = async (phone, otp) => {
  try {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.log(`[Twilio Dev Mode] SMS OTP for ${phone}: ${otp}`);
      return true;
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your Bookify verification code is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return true;
  } catch (error) {
    console.error("Twilio Error:", error.message);
    return false;
  }
};

export default sendOTP;