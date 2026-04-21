import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock } from "lucide-react";

import toast from "react-hot-toast";

const contactInfo = [
  { icon: Mail, label: "Email Us", value: "support@skill2job.com", sub: "We reply within 24 hours" },
  { icon: Phone, label: "Call Us", value: "+91 98765 43210", sub: "Mon–Fri, 9am–6pm IST" },
  { icon: MapPin, label: "Office", value: "Ranchi, Jharkhand", sub: "India" },
  { icon: Clock, label: "Response Time", value: "< 24 Hours", sub: "Average response time" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
    

      {/* HERO */}
      <section className="relative pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              We'd Love to<br />
              <span className="text-green-600">Hear From You</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Have a question, suggestion, or just want to say hello? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-12 md:py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => (
              <motion.div key={info.label} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition">
                <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <info.icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{info.label}</div>
                <div className="font-semibold text-sm text-gray-800">{info.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{info.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10 md:gap-14">

            {/* Sidebar */}
            <motion.div {...fadeUp} className="md:col-span-2 space-y-6">
              <div>
                <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Why Contact Us?</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight leading-tight">We're Here to Help</h2>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  Whether you're a job seeker looking for guidance or a recruiter with platform questions, our team is ready.
                </p>
              </div>
              {[
                { icon: MessageSquare, title: "General Inquiries", desc: "Questions about our platform or services" },
                { icon: CheckCircle, title: "Technical Support", desc: "Need help with your account or a feature" },
                { icon: Mail, title: "Partnerships", desc: "Interested in collaborating with Skill2Job" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="md:col-span-3">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 shadow-md">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-sm text-green-600 font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow-md text-sm disabled:opacity-60">
                    {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      
    </div>
  );
}