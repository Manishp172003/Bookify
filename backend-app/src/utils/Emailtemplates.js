const wrapper = (title, bodyHtml) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f5f7;padding:32px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:10px;padding:32px;">
    <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Bookify</h1>
    <h2 style="margin:0 0 20px;font-size:17px;color:#374151;font-weight:600;">${title}</h2>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
    <p style="font-size:12px;color:#9ca3af;margin:0;">
      If you did not request this, you can safely ignore this email.
    </p>
  </div>
</div>
`;

export const otpEmailTemplate = (fullName, otp) =>
  wrapper(
    "Verify your account",
    `
    <p style="font-size:15px;color:#374151;">Hi ${fullName || "there"},</p>
    <p style="font-size:15px;color:#374151;">Use the code below to verify your Bookify account.</p>
    <div style="margin:24px 0;text-align:center;">
      <span style="display:inline-block;font-size:30px;letter-spacing:8px;font-weight:700;color:#111827;background:#f3f4f6;padding:14px 22px;border-radius:8px;">${otp}</span>
    </div>
    <p style="font-size:14px;color:#6b7280;">This code expires in 10 minutes.</p>
  `
  );

export const resetPasswordEmailTemplate = (fullName, resetLink) =>
  wrapper(
    "Reset your password",
    `
    <p style="font-size:15px;color:#374151;">Hi ${fullName || "there"},</p>
    <p style="font-size:15px;color:#374151;">Click the button below to set a new password for your Bookify account.</p>
    <div style="margin:26px 0;text-align:center;">
      <a href="${resetLink}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:8px;">Reset Password</a>
    </div>
    <p style="font-size:13px;color:#6b7280;word-break:break-all;">Or paste this link into your browser:<br />${resetLink}</p>
    <p style="font-size:14px;color:#6b7280;">This link expires in 15 minutes.</p>
  `
  );