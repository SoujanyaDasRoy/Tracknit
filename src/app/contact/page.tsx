
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Mail, Phone } from "lucide-react";
import Link from "next/link";

const CONTACT_CHANNELS = [
  {
    title: "Customer Support",
    description:
      "Questions about billing, account access, subscriptions, or copyright claims.",
    detail: "support@tracknit.com",
  },
  {
    title: "Feedback and Suggestions",
    description:
      "Share product feedback, workflow issues, or ideas that could improve Tracknit.",
    detail: "hello@tracknit.com",
  },
  {
    title: "Media Inquiries",
    description:
      "For partnerships, interviews, and press-related requests from creators or brands.",
    detail: "media@tracknit.com",
  },
];

const SUPPORT_EMAIL = "support@tracknit.com";
const SUPPORT_PHONE = "+91 8412906664";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const messageCount = form.message.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim() || "Website Contact";
    const subject = `Tracknit Contact Request from ${fullName}`;
    const body = [
      `Name: ${fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phoneNumber || "Not provided"}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="font-body">
      <section className="relative overflow-hidden py-32 bg-[linear-gradient(180deg,#f7fce8_0%,#eef7e8_100%)] text-white">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[840px] -translate-x-1/2 rounded-full bg-primary/[0.10] blur-[140px] pointer-events-none" />
          <div className="absolute left-[-120px] top-28 h-[360px] w-[360px] rounded-full bg-primary/[0.10] blur-[120px] pointer-events-none" />
          <div className="absolute right-[-100px] top-40 h-[320px] w-[320px] rounded-full bg-white/[0.70] blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/[0.07] bg-[#0f141b] shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_460px]">
              <motion.div
                initial={{ opacity: 0, x: -26 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
                className="border-b border-white/[0.06] px-6 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-12"
              >
                <div className="max-w-[560px]">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-white/58">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Contact Desk
                  </div>

                  <h1 className="mt-8 max-w-[520px] text-5xl font-black leading-[0.9] tracking-[-0.06em] text-white md:text-6xl">
                    Contact us without
                    <br />
                    the back-and-
                    <br />
                    forth.
                  </h1>
                  <p className="mt-5 max-w-[430px] text-base leading-7 text-white/56 md:text-lg">
                    Reach the Tracknit team for licensing support, account help, claim resolution, or partnership inquiries.
                  </p>

                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-primary/30 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="flex items-center gap-3 text-sm font-semibold text-white">
                        <Mail size={16} className="text-primary" />
                        {SUPPORT_EMAIL}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/45">
                        Best for claims, billing support, and account questions.
                      </p>
                    </a>

                    <a
                      href={`tel:${SUPPORT_PHONE}`}
                      className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-primary/30 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="flex items-center gap-3 text-sm font-semibold text-white">
                        <Phone size={16} className="text-primary" />
                        +91 8412906664
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/45">
                        Prefer speaking to someone directly for urgent issues.
                      </p>
                    </a>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-white/72">
                    <Clock3 size={14} className="text-primary" />
                    Typical response time: 1-4 hours
                  </div>
                </div>

                <div className="mt-12 grid gap-5 md:grid-cols-3">
                  {CONTACT_CHANNELS.map((channel) => (
                    <div
                      key={channel.title}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col"
                    >
                      <h2 className="text-base font-bold tracking-[-0.03em] text-white">
                        {channel.title}
                      </h2>
                      <p className="mt-3 text-[13px] leading-6 text-white/46">
                        {channel.description}
                      </p>
                      <p className="mt-auto pt-4 text-sm font-semibold text-primary">
                        {channel.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 26 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.14, ease: "easeOut" }}
                className="bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] px-6 py-10 sm:px-8 lg:px-9 lg:py-12"
              >
                {submitted ? (
                  <div className="flex h-full min-h-[560px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                      <CheckCircle2 size={30} className="text-primary" />
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white">
                      Message sent
                    </h2>
                    <p className="mt-3 max-w-[290px] text-sm leading-6 text-white/52">
                      We&apos;ll reply to {form.email || "your inbox"} as quickly as possible.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Send Another
                      </button>
                      <Link
                        href="/pricing"
                        className="rounded-full border border-white/[0.08] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        View Plans
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                        Get in Touch
                      </p>
                      <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.05em] text-white">
                        Start the conversation
                      </h2>
                      <p className="mt-4 max-w-[320px] text-sm leading-6 text-white/48">
                        Fill out the form and your email app will open a ready-to-send message to the right team.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="First name"
                          value={form.firstName}
                          onChange={(event) =>
                            setForm({ ...form, firstName: event.target.value })
                          }
                          className="h-12 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-primary/35 focus:bg-white/[0.05]"
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={form.lastName}
                          onChange={(event) =>
                            setForm({ ...form, lastName: event.target.value })
                          }
                          className="h-12 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-primary/35 focus:bg-white/[0.05]"
                        />
                      </div>

                      <label className="flex h-12 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 transition focus-within:border-primary/35 focus-within:bg-white/[0.05]">
                        <Mail size={16} className="text-white/32" />
                        <input
                          type="email"
                          required
                          placeholder="Your email"
                          value={form.email}
                          onChange={(event) =>
                            setForm({ ...form, email: event.target.value })
                          }
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/24"
                        />
                      </label>

                      <input
                        type="tel"
                        placeholder="Phone"
                        value={form.phoneNumber}
                        onChange={(event) =>
                          setForm({ ...form, phoneNumber: event.target.value })
                        }
                        className="h-12 w-full rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-primary/35 focus:bg-white/[0.05]"
                      />

                      <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4 transition focus-within:border-primary/35 focus-within:bg-white/[0.05]">
                        <textarea
                          required
                          rows={6}
                          placeholder="How can we help?"
                          value={form.message}
                          onChange={(event) =>
                            setForm({ ...form, message: event.target.value })
                          }
                          className="min-h-[150px] w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/24"
                        />
                        <div className="mt-3 text-right text-xs text-white/24">
                          {messageCount} characters
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="h-12 w-full rounded-full bg-primary/90 text-black text-sm font-medium tracking-[0.01em] transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Send Message
                      </button>

                      <p className="px-2 text-center text-xs text-white/30">
                        We respect your privacy. Your info is only used to respond to your message.
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
