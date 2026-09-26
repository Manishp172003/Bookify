export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}) => {
  if (
    !process.env.BREVO_API_KEY ||
    !process.env.BREVO_SENDER_EMAIL
  ) {
    throw new Error("Email service is not configured");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  if (!htmlContent) {
    throw new Error("Email HTML content is required");
  }

  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name:
              process.env.BREVO_SENDER_NAME || "Bookify",
            email: process.env.BREVO_SENDER_EMAIL,
          },

          to: [
            {
              email: to,
            },
          ],

          subject,
          htmlContent,
        }),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof data === "object"
          ? data?.message
          : data;

      throw new Error(
        errorMessage || "Brevo email sending failed"
      );
    }

    return data;
  } catch (error) {
    console.error("Brevo email error:", error);

    throw new Error(
      error.message || "Failed to send email"
    );
  }
};