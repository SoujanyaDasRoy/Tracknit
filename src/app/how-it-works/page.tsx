"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Download,
  Globe,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Users
} from "lucide-react";

const workflowSteps = [
  {
    number: "Step 01",
    icon: Search,
    title: "Discover the right track",
    description: "Browse Tracknit's curated library of royalty-free music and sound effects built for creators, brands, and agencies.",
    points: [
      "Filter by mood, genre, video style, and platform",
      "Preview instantly before you commit",
      "Find background music that fits YouTube, Reels, ads, and podcasts"
    ]
  },
  {
    number: "Step 02",
    icon: Download,
    title: "License and download instantly",
    description: "Choose a subscription and get immediate access to unlimited downloads, sound effects, and clear creator-friendly usage rights.",
    points: [
      "Unlimited royalty-free music downloads",
      "High-quality sound effects included",
      "Clear licensing for creators and businesses"
    ]
  },
  {
    number: "Step 03",
    icon: BadgeCheck,
    title: "Publish and monetize with confidence",
    description: "Use Tracknit music in your content and publish across your channels knowing your usage is covered and monetization safe.",
    points: [
      "YouTube videos and monetized channels",
      "Social content, podcasts, livestreams, and ads",
      "Client projects, branded videos, and campaigns"
    ]
  }
];

const usageBadges = [
  "YouTube videos and monetized channels",
  "Instagram Reels and social media content",
  "Podcasts and livestreams",
  "Client projects and brand campaigns",
  "Online advertisements",
  "Website and branded videos"
];

const licenseSnapshot = [
  {
    label: "Content you can publish",
    value: "YouTube, Instagram, podcasts, livestreams, ads, branded videos"
  },
  {
    label: "Monetization safety",
    value: "Designed for monetized creator workflows and commercial publishing"
  },
  {
    label: "Included assets",
    value: "Royalty-free music plus professional sound effects"
  },
  {
    label: "Commercial usage",
    value: "Available for creators, businesses, client work, and campaign usage by plan"
  },
  {
    label: "After cancellation",
    value: "Content published during an active subscription stays licensed"
  }
];

const includedFeatures = [
  {
    icon: Sparkles,
    title: "Unlimited creativity",
    description: "Explore new sounds for every project with unlimited music and sound effect downloads."
  },
  {
    icon: Shield,
    title: "Royalty-free and copyright safe",
    description: "Use tracks without ongoing fees, complicated paperwork, or constant copyright anxiety."
  },
  {
    icon: Briefcase,
    title: "Commercial use ready",
    description: "Use Tracknit music in branded videos, ads, and client work depending on your plan."
  },
  {
    icon: Globe,
    title: "Built for every platform",
    description: "Use the same library across YouTube, Instagram, podcasts, marketing videos, and digital ads."
  }
];

const whoItsFor = [
  "YouTubers and video creators",
  "Podcasters",
  "Social media influencers",
  "Digital marketers",
  "Freelancers and agencies",
  "Brands and startups"
];

const confidencePoints = [
  "No complicated licenses or hidden royalties",
  "Unlimited royalty-free music and SFX access",
  "Commercial-ready workflows for client and brand work",
  "Content published during an active subscription stays licensed"
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050505] font-body text-white selection:bg-primary selection:text-black">
      <section className="relative overflow-hidden bg-[#050505] px-6 pb-20 pt-32 text-center lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[840px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />
        <div className="relative z-10 mx-auto max-w-[896px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
            <PlayCircle className="h-3 w-3 text-primary" />
            How Tracknit Works
          </div>
          <h1 className="mt-8 text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-[60px] lg:text-[72px]">
            License royalty-free music <span className="text-primary">in minutes</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[768px] text-base font-medium leading-relaxed text-white/55 md:text-lg">
            Discover tracks fast, download with clear usage rights, and publish without worrying about copyright claims or hidden royalties.
          </p>
          <p className="mx-auto mt-3 max-w-[672px] text-sm font-medium leading-relaxed text-white/35 md:text-base">
            One subscription. Unlimited downloads. Built for modern creator workflows.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-black shadow-[0_0_40px_rgba(124,255,0,0.16)] transition-all hover:bg-primary/90 sm:w-auto"
            >
              View Plans <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
            </Link>
            <Link
              href="/music"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-white/[0.08] sm:w-auto"
            >
              Browse Library
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] bg-[#050505] px-6 pb-24 lg:px-12">
        <div className="mb-14 max-w-[672px]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Workflow</p>
          <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.04em] text-white md:text-5xl">
            Get licensed in three clear steps
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <div
              key={step.number}
              className="rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-7 shadow-[0_20px_60px_-50px_rgba(124,255,0,0.08),0_0_0_1px_rgba(124,255,0,0.03)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                  {step.number}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <step.icon className="h-[18px] w-[18px] text-primary" strokeWidth={2} />
                </div>
              </div>
              <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.04em] text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-sm font-medium leading-relaxed text-white/55">
                {step.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6">
                {step.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm font-medium leading-[1.4] text-white/70">
                    <CheckCircle2 className="mt-0.5 h-[15px] w-[15px] shrink-0 text-primary/90" strokeWidth={2} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#050505] py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Usage Rights</p>
            <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.04em] text-white md:text-5xl">
              Clear licensing for creators and businesses
            </h2>
            <p className="mt-5 max-w-[576px] text-base font-medium leading-relaxed text-white/55">
              Tracknit is built so you can move from track discovery to publication with a clear understanding of where and how your license works.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {usageBadges.map((badge) => (
                <div key={badge} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <span className="text-sm font-medium text-white/70">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0b0d11] shadow-[0_20px_60px_-50px_rgba(124,255,0,0.12)]">
            <div className="border-b border-white/[0.07] px-6 py-5 lg:px-7">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">License Snapshot</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">What your subscription covers</h3>
            </div>
            <div className="flex flex-col">
              {licenseSnapshot.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid gap-3 px-6 py-5 lg:grid-cols-[220px_1fr] lg:px-7 ${index === 0 ? "" : "border-t border-white/[0.06]"}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">{row.label}</p>
                  <p className="text-sm font-medium leading-relaxed text-white/70">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 bg-[#050505] px-6 py-24 lg:grid-cols-[0.88fr_1.12fr] lg:px-12">
        <div className="rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-7 shadow-[0_20px_60px_-50px_rgba(124,255,0,0.08)]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Included</p>
          <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.04em] text-white md:text-5xl">
            Built for modern creator workflows
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-white/55">
            Everything in Tracknit is designed to remove friction: discovery, licensing, downloads, and safe publishing across the platforms you already use.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {includedFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <feature.icon className="h-[17px] w-[17px] text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-white">{feature.title}</h3>
                </div>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/55">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/[0.07] bg-[#0b0d11] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Who It&apos;s For</p>
            <h3 className="mt-4 text-2xl font-black leading-[1.2] tracking-[-0.04em] text-white">
              Trusted by creators, teams, and brands
            </h3>
            <div className="mt-8 flex flex-col gap-3">
              {whoItsFor.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium leading-[1.4] text-white/70">
                  <Users className="h-[15px] w-[15px] shrink-0 text-primary/90" strokeWidth={2} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/[0.07] bg-[#0b0d11] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Confidence</p>
            <h3 className="mt-4 text-2xl font-black leading-[1.2] tracking-[-0.04em] text-white">
              Publish without second-guessing the license
            </h3>
            <div className="mt-8 flex flex-col gap-3">
              {confidencePoints.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium leading-[1.4] text-white/70">
                  <CheckCircle2 className="mt-0.5 h-[15px] w-[15px] shrink-0 text-primary/90" strokeWidth={2} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/80">Safe for monetization</p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/65">
                Tracknit is designed for creators who need YouTube-safe, copyright-conscious music they can actually publish and monetize.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/[0.07] bg-[#0b0d11] p-7 md:col-span-2">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[672px]">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">Next Step</p>
                <h3 className="mt-4 text-2xl font-black leading-[1.2] tracking-[-0.04em] text-white md:text-3xl">
                  Start exploring royalty-free music today
                </h3>
                <p className="mt-4 text-base font-medium leading-relaxed text-white/55">
                  Discover background tracks and sound effects designed for YouTube, podcasts, social media, ads, and branded content.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-all hover:bg-primary/90"
                >
                  Pricing
                </Link>
                <Link
                  href="/music"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-all hover:bg-white/90"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}