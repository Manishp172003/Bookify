import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your Bookify verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('Twilio Error:', error);
    return false;
  }
};