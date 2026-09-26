const wrapper = (title, bodyHtml) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f5f7;padding:32px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:10px;padding:32px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:28px;">
      <h1 style="margin:0;font-size:26px;color:#111827;">
        Bookify
      </h1>

      <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
        Your Digital Book Marketplace
      </p>
    </div>

    <!-- Title -->
    <h2 style="margin:0 0 20px;font-size:18px;color:#374151;font-weight:600;">
      ${title}
    </h2>

    <!-- Email Content -->
    ${bodyHtml}

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 20px;" />

    <!-- Security Notice -->
    <p style="font-size:12px;line-height:18px;color:#9ca3af;margin:0 0 16px;">
      If you did not request this email, you can safely ignore it.
      For your security, never share your OTP or password with anyone.
    </p>

    <!-- Contact Details -->
    <div style="text-align:center;border-top:1px solid #f3f4f6;padding-top:18px;">

      <p style="font-size:13px;color:#6b7280;margin:0 0 6px;">
        Need help?
      </p>

      <p style="font-size:13px;margin:0 0 8px;">
        <a
          href="mailto:${process.env.BREVO_SENDER_EMAIL || "support@bookify.com"}"
          style="color:#111827;text-decoration:none;font-weight:600;"
        >
          ${process.env.BREVO_SENDER_EMAIL || "support@bookify.com"}
        </a>
      </p>

      <p style="font-size:12px;color:#9ca3af;margin:0;">
        Bookify · Books made simple
      </p>

      <p style="font-size:11px;color:#d1d5db;margin:12px 0 0;">
        © ${new Date().getFullYear()} Bookify. All rights reserved.
      </p>

    </div>

  </div>
</div>
`;

export const otpEmailTemplate = (fullName, otp) =>
  wrapper(
    "Verify your account",
    `
    <p style="font-size:15px;color:#374151;">
      Hi ${fullName || "there"},
    </p>

    <p style="font-size:15px;line-height:22px;color:#374151;">
      Welcome to <strong>Bookify</strong>!
      Use the verification code below to verify your email address
      and activate your account.
    </p>

    <div style="margin:28px 0;text-align:center;">
      <span
        style="
          display:inline-block;
          font-size:30px;
          letter-spacing:8px;
          font-weight:700;
          color:#111827;
          background:#f3f4f6;
          padding:14px 22px;
          border-radius:8px;
        "
      >
        ${otp}
      </span>
    </div>

    <p style="font-size:14px;color:#6b7280;margin-bottom:8px;">
      This verification code will expire in <strong>10 minutes</strong>.
    </p>

    <p style="font-size:13px;color:#9ca3af;">
      For your security, please do not share this OTP with anyone.
    </p>
  `
);

export const resetPasswordEmailTemplate = (fullName, resetLink) =>
  wrapper(
    "Reset your password",
    `
    <p style="font-size:15px;color:#374151;">
      Hi ${fullName || "there"},
    </p>

    <p style="font-size:15px;line-height:22px;color:#374151;">
      We received a request to reset the password for your
      <strong>Bookify</strong> account.
    </p>

    <p style="font-size:15px;line-height:22px;color:#374151;">
      Click the button below to create a new password.
    </p>

    <div style="margin:28px 0;text-align:center;">
      <a
        href="${resetLink}"
        style="
          display:inline-block;
          background:#111827;
          color:#ffffff;
          text-decoration:none;
          font-size:15px;
          font-weight:600;
          padding:13px 26px;
          border-radius:8px;
        "
      >
        Reset Password
      </a>
    </div>

    <p style="font-size:13px;color:#6b7280;line-height:20px;">
      Or copy and paste this link into your browser:
    </p>

    <p
      style="
        font-size:12px;
        color:#6b7280;
        word-break:break-all;
        background:#f9fafb;
        padding:10px;
        border-radius:6px;
      "
    >
      ${resetLink}
    </p>

    <p style="font-size:14px;color:#6b7280;">
      This password reset link will expire in <strong>15 minutes</strong>.
    </p>

    <p style="font-size:13px;color:#9ca3af;">
      If you did not request a password reset, no action is required.
      Your password will remain unchanged.
    </p>
  `
);