import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Seo from "../components/Seo";

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: `We collect information you provide directly — your name, email, phone number, resume content, education and work history, and skills — when you create an account or use our tools. For recruiters, we also collect company details. We automatically collect basic usage data (pages visited, actions taken) to keep the platform working and to improve it.`,
  },
  {
    title: "2. How we use your information",
    body: `We use your information to operate the platform: matching you to relevant jobs, scoring your resume, running mock interviews and assessments, and connecting recruiters with candidates. We also use it to send you account-related notifications (application updates, password resets) and, where relevant, to respond to support requests.`,
  },
  {
    title: "3. Sharing your information",
    body: `Your profile and application details are shared with the recruiters you apply to. We use trusted third-party services to operate the platform — Cloudinary for file storage, and standard email delivery for transactional messages — who only process your data on our behalf. We do not sell your personal information to third parties.`,
  },
  {
    title: "4. Data retention",
    body: `We retain your account data for as long as your account is active. You can request deletion of your account and associated data at any time by contacting us — see the Contact page.`,
  },
  {
    title: "5. Your rights",
    body: `You can access, update, or delete your profile information directly from your account settings at any time. You may also request a copy of the data we hold about you, or ask us to delete it, by reaching out to our support team.`,
  },
  {
    title: "6. Security",
    body: `We use industry-standard measures to protect your data, including encrypted password storage, rate limiting, and access controls on all data endpoints. No system is perfectly secure, but we treat your data's protection seriously.`,
  },
  {
    title: "7. Cookies",
    body: `We use essential session storage to keep you logged in. We do not use third-party advertising cookies or trackers.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this policy from time to time. Material changes will be reflected here with an updated date.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Seo
        title="Privacy Policy"
        description="How Skill2Career collects, uses, and protects your personal information."
        path="/privacy"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-pine/8 border border-pine/20 flex items-center justify-center mb-5">
          <ShieldCheck className="w-5.5 h-5.5 text-pine" />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mb-2">Privacy Policy</h1>
        <p className="text-sm text-ink/40 mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-base font-bold text-ink mb-2">{s.title}</h2>
              <p className="text-sm text-ink/60 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-mist">
          <p className="text-sm text-ink/50">
            Questions about this policy?{" "}
            <Link to="/contact" className="text-pine font-semibold hover:underline">
              Contact us
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
