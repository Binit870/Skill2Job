import { sendEmail, emailShell, button } from "./sendEmail.js";

const sendResetEmail = async (toEmail, resetLink) => {
  await sendEmail({
    to: toEmail,
    subject: "Reset Your Password — Skill2Career",
    html: emailShell(
      "Reset your password",
      `<p style="color:#2B322D; font-size:14px; line-height:1.6;">
        You requested a password reset for your Skill2Career account.
        Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
      </p>
      ${button("Reset Password", resetLink)}
      <p style="color:#9a9e96; font-size:12px;">
        If you didn't request this, you can safely ignore this email.
      </p>`
    ),
  });
};

export default sendResetEmail;
