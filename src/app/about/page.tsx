import Link from "next/link";
import {
  Clapperboard,
  Mic2,
  Heart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About | Tracknit",
  description:
    "Tracknit exists for moments where visuals speak—but sound decides how they're felt. Learn about our story, our founder, and why creators choose us.",
};

const WHY_ITEMS = [
  {
    icon: Clapperboard,
    title: "Story-aware sound",
    description:
      "Every track is designed to sit naturally inside a story—blending seamlessly with visuals, never competing with them.",
  },
  {
    icon: Mic2,
    title: "Producer-crafted audio",
    description:
      "Made by producers who understand real editing workflows. Not generated. Not filler. Purpose-built for post.",
  },
  {
    icon: Heart,
    title: "Emotion-driven tracks",
    description:
      "Music organised by feel, pacing, and narrative—not just genre tags. Find the right sound faster, every time.",
  },
  {
    icon: ShieldCheck,
    title: "Creator-friendly access",
    description:
      "Clear, uncomplicated licensing. Use it on YouTube, podcasts, ads, and client work without chasing claims.",
  },
];

export default function AboutPage() {
  return (
    <div className="font-body text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO  (Dark #050505)
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#050505] px-6 pb-28 pt-40 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7CFF00]/4 blur-[160px]" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-white/[0.015] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <span className="mb-6 inline-block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            Our Story
          </span>

          <h1 className="text-[clamp(38px,5.5vw,76px)] font-black leading-[0.92] tracking-[-0.04em] text-white">
            Tracknit exists for moments
            <br />
            where{" "}
            <span className="italic text-white/40">visuals speak</span>
            <span className="text-white">—</span>
            <br />
            but{" "}
            <span className="text-[#7CFF00]">sound decides</span>
            <br className="hidden sm:block" />
            {" "}how they&apos;re felt.
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-[17px] font-medium leading-relaxed text-white/45">
            A platform built not on quantity, but on intent—
            where every sound knows when to speak, and when to stay out of the way.
          </p>
        </div>

        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#111111]" />
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — FOUNDER STORY  (Dark #111111)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#111111] px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

            {/* Left: Portrait */}
            <div className="relative">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80"
                  alt="Tarun Rao — Founder of Tracknit"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Caption overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.36em] text-white/40">
                    Founder
                  </p>
                  <h3 className="text-2xl font-black leading-none tracking-tight text-white">
                    Tarun Rao
                  </h3>
                  <p className="mt-1.5 text-[13px] font-medium text-white/55">
                    Music Producer &amp; Sound Designer · Pune
                  </p>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="pointer-events-none absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-[#7CFF00]/6 blur-[80px]" />
            </div>

            {/* Right: Story Text */}
            <div className="flex flex-col justify-center">
              <span className="mb-5 block text-[10px] font-black uppercase tracking-[0.4em] text-white/25">
                The Origin
              </span>

              <h2 className="mb-8 text-[clamp(32px,3.5vw,50px)] font-black leading-[1.0] tracking-[-0.04em] text-white">
                Built from the gap
                <br />
                every creator feels.
              </h2>

              <div className="space-y-5 text-[16px] font-medium leading-relaxed text-white/55">
                <p>
                  Tarun Rao is a multi-genre music producer and sound design enthusiast
                  based in Pune. After years of producing music and working closely with
                  artists and creators, he repeatedly faced the same challenge: most available
                  music didn&apos;t fit the story.
                </p>
                <p>
                  It filled space, but rarely filled <em className="text-white/80 not-italic">meaning</em>.
                </p>
                <p>
                  So he began building his own sounds—designed around emotion, pacing, and
                  narrative instead of categories or trends. That process evolved into Tracknit.
                </p>
              </div>

              {/* Pull quote */}
              <blockquote className="mt-10 border-l-2 border-[#7CFF00]/50 pl-6">
                <p className="text-[18px] font-semibold italic leading-snug text-white/80">
                  &ldquo;The focus is always on feel first, polish second,
                  and flexibility throughout.&rdquo;
                </p>
                <cite className="mt-3 block text-[11px] font-black uppercase not-italic tracking-[0.3em] text-white/30">
                  — Tarun Rao, Founder
                </cite>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — MORE THAN A LIBRARY  (Light #E5E5E5)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#E5E5E5] px-6 py-24 lg:py-32 text-black">
        <div className="mx-auto max-w-[1280px]">

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">

            {/* Left: Editorial Text */}
            <div>
              <span className="mb-5 block text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                Our Philosophy
              </span>
              <h2 className="text-[clamp(36px,4vw,60px)] font-black leading-[0.95] tracking-[-0.04em] text-black">
                More than
                <br />
                a music library.
              </h2>

              <p className="mt-8 max-w-md text-[16px] font-medium leading-relaxed text-black/55">
                Tracknit isn&apos;t built on quantity. It&apos;s built on intent. Every track,
                texture, and soundscape is created to sit naturally inside a story—whether
                that story unfolds in a film, a reel, a podcast, an ad, or a late-night edit.
              </p>
            </div>

            {/* Right: Bold statement card */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] bg-black px-10 py-12 shadow-2xl">
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#7CFF00]/8 blur-[80px]" />
                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/25 mb-6">
                  The Standard
                </p>
                <p className="relative z-10 text-[clamp(22px,3vw,34px)] font-black leading-[1.15] tracking-[-0.03em] text-white">
                  No filler tracks.
                  <br />
                  No overproduced noise.
                </p>
                <div className="my-8 h-px w-full bg-white/10" />
                <p className="relative z-10 text-[16px] font-medium leading-relaxed text-white/50">
                  Just sound that knows when to speak—
                  <span className="text-white/80"> and when to stay out of the way.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — WHY CREATORS CHOOSE  (Dark #0b0d11)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0b0d11] px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px]">

          <div className="mb-14 text-center">
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-white/25">
              What Sets Us Apart
            </span>
            <h2 className="text-[clamp(32px,4vw,56px)] font-black leading-[0.98] tracking-[-0.04em] text-white">
              Why creators choose
              <br />
              <span className="text-[#7CFF00]">Tracknit</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative flex flex-col rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#7CFF00]/25 hover:bg-white/[0.035] hover:shadow-[0_24px_60px_-20px_rgba(124,255,0,0.1)]"
                >
                  {/* Icon */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04] text-[#7CFF00] transition-colors group-hover:border-[#7CFF00]/20 group-hover:bg-[#7CFF00]/10">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>

                  <h3 className="mb-3 text-[17px] font-bold leading-snug tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] font-medium leading-relaxed text-white/45 group-hover:text-white/58 transition-colors">
                    {item.description}
                  </p>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full bg-[#7CFF00]/0 blur-[40px] transition-all duration-500 group-hover:bg-[#7CFF00]/8" />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — BUILT FROM THE GAP  (Dark #111111 w/ glow CTA)
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#111111] px-6 pb-32 pt-24 lg:pb-40 lg:pt-32">
        {/* Center glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7CFF00]/5 blur-[140px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[860px] text-center">

          <span className="mb-6 block text-[10px] font-black uppercase tracking-[0.4em] text-white/25">
            The Mission
          </span>

          <p className="mx-auto max-w-2xl text-[clamp(18px,2.5vw,26px)] font-medium leading-relaxed text-white/55">
            Tracknit was born from the space between storytelling and sound—the exact moment
            where most creators feel something missing but can&apos;t quite name it.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-[clamp(16px,2vw,20px)] font-medium leading-relaxed text-white/40">
            This platform exists to fill that gap, helping stories breathe, flow,
            and connect more deeply.
          </p>

          {/* Divider */}
          <div className="mx-auto my-14 h-px w-24 bg-white/10" />

          {/* Closing statement */}
          <h2 className="text-[clamp(48px,7vw,96px)] font-black italic leading-[0.9] tracking-[-0.05em] text-white">
            Welcome to
            <br />
            <span className="text-[#7CFF00] not-italic">Tracknit.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-md text-[15px] font-medium text-white/35">
            If sound matters to your story, you&apos;re already in the right place.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/library/royalty-free-music"
              className="flex items-center gap-2 rounded-full bg-[#7CFF00] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-black shadow-lg shadow-[#7CFF00]/20 transition-all hover:scale-105"
            >
              Browse Music <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              View Plans
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
