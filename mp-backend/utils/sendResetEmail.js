import nodemailer from "nodemailer";

const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Skill2Job" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your Password — Skill2Job",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #065f46; margin-bottom: 8px;">Reset Your Password</h2>
        <p style="color: #6b7280; font-size: 14px;">
          You requested a password reset for your Skill2Job account.
          Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetLink}"
          style="display: inline-block; margin: 24px 0; padding: 12px 28px;
                 background: #059669; color: #fff; border-radius: 8px;
                 text-decoration: none; font-weight: 600; font-size: 14px;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.<br/>
          This link will expire in 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #d1d5db; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Skill2Job</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetEmail;