import nodemailer from "nodemailer";

let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Wraps email body content in a consistent, branded HTML shell.
 * @param {string} heading
 * @param {string} bodyHtml - inner HTML (paragraphs, button, etc.)
 */
export const emailShell = (heading, bodyHtml) => `
  <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #E7E4DA; border-radius: 16px; background: #ffffff;">
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
      <div style="width:28px; height:28px; border-radius:8px; background:#0E6B52; display:inline-block;"></div>
      <span style="font-size:15px; font-weight:700; color:#0D1512;">Skill2Career</span>
    </div>
    <h2 style="color: #0D1512; margin: 0 0 12px; font-size: 20px;">${heading}</h2>
    ${bodyHtml}
    <hr style="border: none; border-top: 1px solid #E7E4DA; margin: 28px 0 16px;" />
    <p style="color: #9a9e96; font-size: 11px; text-align: center; margin: 0;">
      © ${new Date().getFullYear()} Skill2Career. You're receiving this because of activity on your account.
    </p>
  </div>
`;

export const button = (label, url) => `
  <a href="${url}"
    style="display: inline-block; margin: 20px 0; padding: 12px 28px;
           background: #0E6B52; color: #fff; border-radius: 10px;
           text-decoration: none; font-weight: 600; font-size: 14px;">
    ${label}
  </a>
`;

/**
 * Generic send used by all transactional emails.
 */
export const sendEmail = async ({ to, subject, html }) => {
  // Fail soft: email delivery should never crash the request that triggered
  // it (e.g. a status update). Errors are logged, not thrown.
  try {
    await getTransporter().sendMail({
      from: `"Skill2Career" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};

export const sendApplicationStatusEmail = async ({ to, studentName, jobTitle, company, status }) => {
  const statusCopy = {
    Reviewed: "is now being reviewed by the recruiter.",
    Shortlisted: "has been shortlisted! 🎉",
    Rejected: "was not selected this time.",
    Hired: "— congratulations, you got the job! 🎉",
  };
  const line = statusCopy[status] || `has been updated to "${status}".`;

  await sendEmail({
    to,
    subject: `Application update: ${jobTitle} at ${company}`,
    html: emailShell(
      "Your application status has changed",
      `<p style="color:#2B322D; font-size:14px; line-height:1.6;">
        Hi ${studentName}, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> ${line}
      </p>
      ${button("View application", `${process.env.CLIENT_URL}/student/my-applications`)}`
    ),
  });
};

export const sendNewApplicationEmail = async ({ to, recruiterName, applicantName, jobTitle }) => {
  await sendEmail({
    to,
    subject: `New application: ${jobTitle}`,
    html: emailShell(
      "You've got a new applicant",
      `<p style="color:#2B322D; font-size:14px; line-height:1.6;">
        Hi ${recruiterName}, <strong>${applicantName}</strong> just applied for <strong>${jobTitle}</strong>.
      </p>
      ${button("Review application", `${process.env.CLIENT_URL}/recruiter/candidates-applications`)}`
    ),
  });
};
