import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock, Send, CheckCircle,
  MessageSquare, Briefcase, Users,
  Headphones, Award, Globe
} from "lucide-react";
import toast from "react-hot-toast";
import Seo from "../components/Seo";

// ── COMPANY INFO ──────────────────────────────────────────────────────────────
const companyInfo = {
  name: "Skill2Career",
  email: {
    support: "support@Skill2Career.com",
    sales: "sales@Skill2Career.com",
    partnerships: "partners@Skill2Career.com",
  },
  phone: {
    primary: "+91 98765 43210",
    support: "+91 98765 43211",
  },
  hours: {
    weekdays: "9:00 AM – 6:00 PM IST",
    saturday: "10:00 AM – 2:00 PM IST",
    sunday: "Closed",
  },
};

const contactChannels = [
  {
    icon: Headphones,
    title: "Customer Support",
    email: "support@Skill2Career.com",
    phone: "+91 98765 43210",
    desc: "For account issues, platform troubleshooting, and general assistance.",
  },
  {
    icon: Briefcase,
    title: "Sales & Enterprise",
    email: "sales@Skill2Career.com",
    phone: "+91 98765 43211",
    desc: "Explore bulk hiring solutions, custom pricing, and enterprise plans.",
  },
  {
    icon: Users,
    title: "Partnerships",
    email: "partners@Skill2Career.com",
    phone: "",
    desc: "Interested in collaborations, affiliate programs, or integration opportunities?",
  },
  {
    icon: Globe,
    title: "Press & Media",
    email: "press@Skill2Career.com",
    phone: "",
    desc: "For media inquiries, interviews, and official press resources.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", channel: "support" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "", channel: "support" });
    }, 1200);
  };

  const getStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 0) return { text: "Closed Today", open: false };
    if (day === 6) {
      if (hour >= 10 && hour < 14) return { text: "Open Now", open: true };
      return { text: "Closed", open: false };
    }
    if (hour >= 9 && hour < 18) return { text: "Open Now", open: true };
    return { text: "Closed", open: false };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-white text-ink">
      <Seo
        title="Contact Us"
        description="Get in touch with the Skill2Career team — support, sales, partnerships, and press inquiries."
        path="/contact"
      />

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden border-b border-mist">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full pointer-events-none bg-pine/12 opacity-30 blur-[90px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border bg-pine/8 text-pine border-pine/15 mb-6">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              We're Here to<br />
              <span className="text-pine">Help You Succeed</span>
            </h1>
            <p className="text-base md:text-lg text-ink/50 max-w-2xl mx-auto leading-relaxed">
              Whether you require technical assistance, wish to explore a partnership, or have a
              sales enquiry — our team is available and ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT CHANNELS ── */}
      <section className="py-12 md:py-16 bg-paper/60 border-y border-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-pine">
              Departments
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">Reach the Right Team</h2>
            <p className="text-ink/50 text-sm mt-2 max-w-md mx-auto">
              Direct your enquiry to the appropriate department for a faster, more accurate response.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactChannels.map((channel, i) => (
              <motion.div
                key={channel.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-mist rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-pine/12 text-pine rounded-xl flex items-center justify-center mb-3">
                  <channel.icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-base mb-1">{channel.title}</h3>
                <p className="text-xs text-ink/50 mb-3 leading-relaxed">{channel.desc}</p>
                <a
                  href={`mailto:${channel.email}`}
                  className="text-xs font-medium text-pine hover:underline block"
                >
                  {channel.email}
                </a>
                {channel.phone && (
                  <a href={`tel:${channel.phone}`} className="text-xs text-ink/50 hover:underline block mt-1">
                    {channel.phone}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* SIDEBAR — Business Hours */}
            <motion.div {...fadeUp} className="space-y-6">
              <div className="bg-paper/60 border border-mist rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Business Hours</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.open
                        ? "bg-pine/8 text-pine border-pine/20"
                        : "bg-red-50 text-red-600 border-red-200"
                      }`}
                  >
                    {status.text}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-ink/50">Monday – Friday</span>
                    <span className="font-medium text-right">{companyInfo.hours.weekdays}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-ink/50">Saturday</span>
                    <span className="font-medium text-right">{companyInfo.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-ink/50">Sunday</span>
                    <span className="font-medium text-red-500 text-right">{companyInfo.hours.sunday}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-mist">
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-pine mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Response Guarantee</div>
                      <div className="text-ink/50 text-xs mt-0.5 leading-relaxed">
                        All email enquiries are acknowledged within 24 business hours.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-paper/60 border border-mist rounded-2xl p-5 text-sm space-y-3">
                <div className="flex items-center gap-2 text-pine">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">24-Hour Response SLA</span>
                </div>
                <div className="flex items-center gap-2 text-pine">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Complimentary Support</span>
                </div>
                <p className="text-xs text-ink/50 pt-1 leading-relaxed">
                  Your information is kept strictly confidential and never shared with third parties.
                </p>
              </div>
            </motion.div>

            {/* FORM */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-2">
              <div className="bg-white border border-mist rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-1">Send Us a Message</h2>
                <p className="text-ink/50 text-sm mb-6">
                  Complete the form below and we will route your enquiry to the appropriate team member.
                </p>

                {submitted ? (
                  <div className="text-center py-12 bg-pine/8 rounded-xl">
                    <CheckCircle className="w-12 h-12 text-pine mx-auto mb-3" />
                    <h3 className="text-xl font-bold">Message Received</h3>
                    <p className="text-ink/50 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                      Thank you for reaching out. A member of our team will respond within 24 business hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-5 text-sm font-semibold text-pine hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
                          Full Name *
                        </label>
                        <input
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-paper/60 border border-mist rounded-xl text-sm transition outline-none focus:border-pine focus:ring-1 focus:ring-pine/15"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-paper/60 border border-mist rounded-xl text-sm transition outline-none focus:border-pine focus:ring-1 focus:ring-pine/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
                        Department *
                      </label>
                      <select
                        value={form.channel}
                        onChange={(e) => setForm({ ...form, channel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-paper/60 border border-mist rounded-xl text-sm outline-none focus:border-pine"
                      >
                        <option value="support">Customer Support</option>
                        <option value="sales">Sales & Enterprise</option>
                        <option value="partnerships">Partnerships</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
                        Subject *
                      </label>
                      <input
                        required
                        placeholder="Brief description of your enquiry"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-paper/60 border border-mist rounded-xl text-sm transition outline-none focus:border-pine focus:ring-1 focus:ring-pine/15"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1.5">
                        Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Please provide as much detail as possible so we can assist you effectively."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2.5 bg-paper/60 border border-mist rounded-xl text-sm transition outline-none resize-none focus:border-pine focus:ring-1 focus:ring-pine/15"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 bg-pine text-white font-semibold py-3 rounded-xl hover:bg-moss transition disabled:opacity-60 text-sm"
                    >
                      {loading ? "Sending…" : <><Send className="w-4 h-4" /> Submit Enquiry</>}
                    </button>

                    <p className="text-xs text-ink/40 text-center">
                      Your data is handled with full confidentiality. View our{" "}
                      <Link to="/privacy" className="text-pine hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FLOATING LIVE CHAT BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-pine text-white p-3 rounded-full flex items-center gap-2 group hover:bg-moss transition-all shadow-lg">
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
            Live Chat
          </span>
        </button>
      </div>

    </div>
  );
}