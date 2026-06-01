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

export default function AboutPage() {
  return (
    <div className="font-sans antialiased text-[#0C0C0E] bg-[#F5F4EE] overflow-x-hidden min-h-screen">
      
      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO (Elegant Grey-Blue `#BDBBC8`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#BDBBC8] border-b border-[#0C0C0E]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20 items-center">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0C0C0E]/60 uppercase mb-4 block">
                Our Story
              </span>
              <h1 className="text-[clamp(32px,4.5vw,60px)] font-bold tracking-tight text-[#0C0C0E] leading-[1.05] max-w-2xl">
                Tracknit exists for moments where{" "}
                <span className="text-[#0C0C0E]/60">visuals speak</span>—but{" "}
                <span className="underline decoration-1 underline-offset-4">sound decides</span> how they&apos;re felt.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] lg:text-[16px] text-[#0C0C0E]/75 leading-relaxed font-normal">
                A platform built not on quantity, but on intent—where every sound knows when to speak, and when to stay out of the way.
              </p>
              <div className="mt-8">
                <Link
                  href="/library/royalty-free-music"
                  className="inline-flex items-center justify-center bg-[#0C0C0E] text-white px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-sm hover:bg-[#2A2A2E] transition-all"
                >
                  Browse Music
                </Link>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm shadow-xl aspect-[4/3] lg:aspect-[5/6] bg-[#A9A7B3]">
                <img
                  src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=900&q=80"
                  alt="Tracknit conducting sound"
                  className="w-full h-full object-cover filter contrast-[1.02]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — FOUNDER STORY (Warm Off-white `#F5F4EE`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F4EE]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20 items-start">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0C0C0E]/50 uppercase mb-4 block">
                The Origin
              </span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-[#0C0C0E] leading-tight mb-8">
                Built from the gap every creator feels.
              </h2>
              <div className="space-y-6 text-[15px] text-[#0C0C0E]/70 leading-relaxed font-normal max-w-xl">
                <p>
                  Tarun Rao is a multi-genre music producer and sound design enthusiast based in Pune. After years of producing music and working closely with artists and creators, he repeatedly faced the same challenge: most available music didn&apos;t fit the story.
                </p>
                <p>
                  It filled space, but rarely filled <span className="italic text-[#0C0C0E] font-semibold">meaning</span>.
                </p>
                <p>
                  So he began building his own sounds—designed around emotion, pacing, and narrative instead of categories or trends. That process evolved into Tracknit.
                </p>
              </div>

              {/* Pull quote */}
              <div className="mt-10 border-l-2 border-[#0C0C0E]/20 pl-6 py-2 max-w-xl">
                <p className="text-lg italic text-[#0C0C0E]/85 leading-snug font-medium">
                  &ldquo;The focus is always on feel first, polish second, and flexibility throughout.&rdquo;
                </p>
                <p className="mt-2 text-[10px] font-bold tracking-widest text-[#0C0C0E]/40 uppercase">
                  — Tarun Rao, Founder
                </p>
              </div>
            </div>

            {/* Right Column: Grayscale Styled Portrait */}
            <div className="lg:col-span-5">
              <div className="bg-[#EAE8DE] p-4 rounded-sm shadow-md border border-[#0C0C0E]/5">
                <div className="overflow-hidden rounded-sm bg-[#D5D3C8]">
                  <img
                    src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&q=80"
                    alt="Tarun Rao — Founder of Tracknit"
                    className="w-full aspect-[4/5] object-cover filter grayscale contrast-[1.05]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-[#0C0C0E]/60 uppercase tracking-widest font-bold">
                  <span>Tarun Rao</span>
                  <span>Pune, IN</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — MORE THAN A LIBRARY (Contrast Flip to Deep Charcoal `#0C0C0E`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0C0C0E] text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24 items-center">
            
            {/* Left Column: Bold Pink Art Collage */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm shadow-2xl bg-[#EAEAEA] aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=80"
                  alt="Expressive and original sound art"
                  className="w-full h-full object-cover filter contrast-[1.02]"
                />
              </div>
            </div>

            {/* Right Column: Text and Manifesto Card */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#7CFF00] uppercase mb-4 block">
                Our Philosophy
              </span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-white leading-tight mb-6">
                More than a music library.
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed max-w-xl font-normal">
                Tracknit isn&apos;t built on quantity. It&apos;s built on intent. Every track, texture, and soundscape is created to sit naturally inside a story—whether that story unfolds in a film, a reel, a podcast, an ad, or a late-night edit.
              </p>

              {/* Manifesto Card */}
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-sm max-w-xl mt-8">
                <h4 className="text-sm font-bold text-[#7CFF00] tracking-wider uppercase mb-2">
                  No filler tracks. No overproduced noise.
                </h4>
                <p className="text-sm text-white/60 leading-relaxed font-normal">
                  Just sound that knows when to speak—<span className="text-white/90">and when to stay out of the way.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — STORY & PRODUCER FOCUS (Warm Off-white `#F5F4EE`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F4EE] border-b border-[#0C0C0E]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20 items-center">
            
            {/* Left Column: Why Us Info */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0C0C0E]/50 uppercase mb-4 block">
                What Sets Us Apart
              </span>
              <h2 className="text-[clamp(24px,3vw,38px)] font-bold tracking-tight text-[#0C0C0E] leading-tight mb-10">
                Story-aware sound &amp; producer-crafted audio.
              </h2>
              
              <div className="space-y-10 max-w-xl">
                
                {/* Item 1 */}
                <div className="group">
                  <div className="flex items-center gap-3 text-[16px] font-bold text-[#0C0C0E]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0C0C0E]/5 text-[#0C0C0E] border border-[#0C0C0E]/10 transition-colors group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/25 group-hover:text-black">
                      <Clapperboard className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <h3>Story-aware sound</h3>
                  </div>
                  <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mt-2.5 pl-12 font-normal">
                    Every track is designed to sit naturally inside a story—blending seamlessly with visuals, never competing with them.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="group">
                  <div className="flex items-center gap-3 text-[16px] font-bold text-[#0C0C0E]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0C0C0E]/5 text-[#0C0C0E] border border-[#0C0C0E]/10 transition-colors group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/25 group-hover:text-black">
                      <Mic2 className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <h3>Producer-crafted audio</h3>
                  </div>
                  <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mt-2.5 pl-12 font-normal">
                    Made by producers who understand real editing workflows. Not generated. Not filler. Purpose-built for post.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Column: Cyan Blue Device Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#419DFF] p-6 rounded-sm shadow-xl aspect-square flex items-center justify-center">
                <div className="overflow-hidden rounded-sm w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=900&q=80"
                    alt="Synthesizer audio controller"
                    className="w-full h-full object-cover filter contrast-[1.02]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — EMOTION & LICENSING (Warm Off-white `#F5F4EE`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F4EE]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20 items-center">
            
            {/* Left Column: Bright Pink Artist Grid */}
            <div className="lg:col-span-5 order-last lg:order-first">
              <div className="bg-[#FF6097] p-6 rounded-sm shadow-xl aspect-square grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" 
                  alt="Artist 1" 
                  className="w-full h-full object-cover rounded-sm filter contrast-[1.02]" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" 
                  alt="Artist 2" 
                  className="w-full h-full object-cover rounded-sm filter contrast-[1.02]" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" 
                  alt="Artist 3" 
                  className="w-full h-full object-cover rounded-sm filter contrast-[1.02]" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" 
                  alt="Artist 4" 
                  className="w-full h-full object-cover rounded-sm filter contrast-[1.02]" 
                />
              </div>
            </div>

            {/* Right Column: Why Us Info Continued */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0C0C0E]/50 uppercase mb-4 block">
                Built For Creators
              </span>
              <h2 className="text-[clamp(24px,3vw,38px)] font-bold tracking-tight text-[#0C0C0E] leading-tight mb-10">
                Organized by feel, licensed with absolute clarity.
              </h2>
              
              <div className="space-y-10 max-w-xl">
                
                {/* Item 3 */}
                <div className="group">
                  <div className="flex items-center gap-3 text-[16px] font-bold text-[#0C0C0E]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0C0C0E]/5 text-[#0C0C0E] border border-[#0C0C0E]/10 transition-colors group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/25 group-hover:text-black">
                      <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <h3>Emotion-driven tracks</h3>
                  </div>
                  <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mt-2.5 pl-12 font-normal">
                    Music organised by feel, pacing, and narrative—not just genre tags. Find the right sound faster, every time.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="group">
                  <div className="flex items-center gap-3 text-[16px] font-bold text-[#0C0C0E]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0C0C0E]/5 text-[#0C0C0E] border border-[#0C0C0E]/10 transition-colors group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/25 group-hover:text-black">
                      <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <h3>Creator-friendly access</h3>
                  </div>
                  <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mt-2.5 pl-12 font-normal">
                    Clear, uncomplicated licensing. Use it on YouTube, podcasts, ads, and client work without chasing claims.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — HOW IT WORKS (Warm Off-white `#F5F4EE`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F4EE] border-t border-[#0C0C0E]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
          
          {/* Centered Heading */}
          <div className="text-center mb-16 lg:mb-20">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#0C0C0E]/50 uppercase mb-4 block">
              Workflow
            </span>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-[#0C0C0E]">
              Here&apos;s how it works
            </h2>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Step 1 */}
            <div className="border-t border-[#0C0C0E]/10 pt-8">
              <span className="text-[11px] font-bold tracking-widest text-[#0C0C0E]/40 mb-4 block">
                01 / SIGN UP
              </span>
              <h3 className="text-lg font-bold text-[#0C0C0E] mb-3">
                Sign up
              </h3>
              <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mb-6 font-normal">
                Create a free account in seconds to start auditioning tracks and organizing your projects.
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C0C0E] hover:underline"
              >
                Create free account <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="border-t border-[#0C0C0E]/10 pt-8">
              <span className="text-[11px] font-bold tracking-widest text-[#0C0C0E]/40 mb-4 block">
                02 / FIND
              </span>
              <h3 className="text-lg font-bold text-[#0C0C0E] mb-3">
                Find your sound
              </h3>
              <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mb-6 font-normal">
                Search by mood, pace, or cinematic vibe. Audition tracks instantly in our high-performance library.
              </p>
              <Link 
                href="/library/royalty-free-music" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C0C0E] hover:underline"
              >
                Browse music <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="border-t border-[#0C0C0E]/10 pt-8">
              <span className="text-[11px] font-bold tracking-widest text-[#0C0C0E]/40 mb-4 block">
                03 / CHOOSE
              </span>
              <h3 className="text-lg font-bold text-[#0C0C0E] mb-3">
                Soundtrack your story, worry-free
              </h3>
              <p className="text-[14px] text-[#0C0C0E]/60 leading-relaxed mb-6 font-normal">
                Download tracks and publish your content anywhere with complete peace of mind, protected by our clear license.
              </p>
              <Link 
                href="/pricing" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C0C0E] hover:underline"
              >
                View plans <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — COMPANY INFO & CTA (Contrast Flip to Deep Charcoal `#0C0C0E`)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0C0C0E] text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24 items-center">
            
            {/* Left Column: Company Info and Call to Action */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#7CFF00] uppercase mb-4 block">
                Corporate Profile
              </span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-white leading-tight mb-8">
                Company Information
              </h2>
              
              {/* Structured Metadata Table */}
              <div className="space-y-4 border-t border-white/10 pt-6 max-w-xl text-sm font-normal">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40">Founder</span>
                  <span className="text-white/80 font-medium">Tarun Rao</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40">Headquarters</span>
                  <span className="text-white/80 font-medium">Pune, India</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40">Focus</span>
                  <span className="text-white/80 font-medium">Premium Music Licensing &amp; Sound Design</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40">Mission</span>
                  <span className="text-white/80 font-medium text-right max-w-xs">
                    To fill the space between storytelling and sound.
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40">Support Inquiry</span>
                  <span className="text-white/80 font-medium">contact@tracknit.com</span>
                </div>
              </div>

              {/* Final CTA Statement */}
              <div className="mt-14 max-w-xl">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Welcome to Tracknit.
                </h3>
                <p className="text-sm text-white/50 mt-2 font-normal">
                  If sound matters to your story, you&apos;re already in the right place.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/library/royalty-free-music"
                    className="bg-[#7CFF00] text-[#0C0C0E] px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-sm hover:bg-[#6AD400] transition-all"
                  >
                    Browse Music
                  </Link>
                  <Link
                    href="/pricing"
                    className="border border-white/20 bg-white/5 text-white px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-sm hover:bg-white/10 hover:border-white/35 transition-all"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Yellow Dials Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFD12F] p-6 rounded-sm shadow-2xl aspect-square flex items-center justify-center">
                <div className="overflow-hidden rounded-sm w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80"
                    alt="Synthesizer dialboard"
                    className="w-full h-full object-cover filter contrast-[1.02]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
