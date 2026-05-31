"use client";

import Link from "next/link";

const usageCategories = [
  {
    title: "YouTube & Social",
    description: "Fully cleared for monetization on all platforms. No claims, just creation.",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "Podcasts & Audio",
    description: "Intros, outros, and background beds. Sound as professional as your message.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1374&auto=format&fit=crop",
  },
  {
    title: "Advertising",
    description: "Engage your audience with high-impact sounds for commercials and global ads.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "TV & Film",
    description: "Cinematic scores and soundscapes for indie films and broadcast television.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop",
  },
  {
    title: "Gaming & Streams",
    description: "Atmospheric tracks for gameplay, Twitch streams, and virtual worlds.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "Corporate & Apps",
    description: "Modern audio for brand videos, apps, and professional internal presentations.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop",
  },
  {
    title: "Metaverse & VR",
    description: "Immersive spatial audio for virtual worlds, AR experiences, and the metaverse.",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "Events & In-Store",
    description: "High-energy tracks for live events, retail spaces, and fashion shows.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1470&auto=format&fit=crop",
  },
];

const faqItems = [
  {
    q: "Can I monetize YouTube videos with Tracknit music?",
    a: "Absolutely. All Tracknit music is white-listed for monetization. As long as your channel is linked in your dashboard, you can monetize your videos without receiving any copyright claims.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You stay safe. Every video published during an active subscription remains cleared forever. You only lose the right to use Tracknit music in new projects published after your subscription ends.",
  },
  {
    q: "Can I use Tracknit music for client work?",
    a: "Yes, but this requires our Advanced Plan. The Basic and Intermediate plans are intended for your own owned-and-operated channels.",
  },
  {
    q: "Are sound effects included in the subscription?",
    a: "Yes. All our plans include unlimited access to our high-fidelity SFX library, featuring thousands of curated sound effects for any production.",
  },
];

export default function Home() {
  return (
    <main>
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden font-body bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#7CFF00]/15 via-transparent to-white/5 opacity-80 animate-gradient pointer-events-none" />
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=90&w=2070&auto=format&fit=crop"
            alt="Studio equipment"
            className="w-full h-full object-cover relative z-0"
          />
          <div className="absolute top-1/4 -right-10 w-[400px] h-[400px] bg-[#7CFF00]/20 blur-[100px] z-0 rounded-full" />
          <div className="absolute bottom-1/4 -left-10 w-[300px] h-[300px] bg-white/5 blur-[80px] z-0 rounded-full" />
        </div>
        <div className="relative z-20 px-6 max-w-[1440px] mx-auto w-full">
          <div className="max-w-4xl relative">
            <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#7CFF00]/25 blur-[70px] -z-10 rounded-full pointer-events-none" />
            <h1 className="font-roslane font-black uppercase text-6xl md:text-[96px] drop-shadow-2xl mb-4 leading-[0.82] tracking-tight text-white">
              From start to
              <br />
              <span className="text-[#7CFF00] italic tracking-tight pr-2">success</span>
              <br />
              We track it all
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/70 max-w-[540px] mb-10 leading-[1.75] font-body font-normal tracking-[0.015em]">
              Unlock world-class production music for your digital projects. Simple licensing, zero royalty headaches, maximum impact.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/login"
                className="bg-[#7CFF00] text-black px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_rgba(124,255,0,0.2)] flex items-center justify-center"
              >
                Get Started
              </Link>
              <Link
                href="/music"
                className="bg-white text-black px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center"
              >
                Explore Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="usage" className="py-24 bg-[#52B052] relative overflow-hidden font-body">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="text-black/60 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Endless Possibilities</span>
            <h2 className="text-4xl md:text-7xl font-black mb-12 tracking-tighter text-black leading-[0.9]">
              Music for every <br className="hidden md:block" />
              <span className="italic text-white drop-shadow-sm">creative frontier</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {usageCategories.map((item) => (
              <div key={item.title} className="group relative h-[480px] rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:-translate-y-4 duration-500">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight drop-shadow-xl">{item.title}</h3>
                  <p className="text-white/90 leading-relaxed mb-10 text-sm md:text-base font-medium drop-shadow-sm">{item.description}</p>
                  <Link href="/music" className="w-full py-4 bg-white text-center text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-colors shadow-xl group-hover:shadow-primary/20 block">
                    Explore Library
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="pt-16 pb-32 bg-[#E5E5E5] relative overflow-hidden font-body text-black">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16 xl:gap-24">
            <div className="lg:w-1/2 pt-0 md:pt-4 lg:pt-0">
              <div className="relative aspect-[16/18] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1470&auto=format&fit=crop"
                  alt="Tracknit Studio"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-3">Support & License</p>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight max-w-[280px]">We&apos;re here to help you clear every claim.</h3>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 pt-0 md:pt-4 lg:pt-0">
              <div className="mb-12">
                <span className="text-black/30 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Help Center</span>
                <h2 className="text-4xl lg:text-5xl font-black text-black leading-none tracking-tight mb-6 uppercase">
                  Frequently Asked <br /> Questions
                </h2>
                <p className="text-base text-black/50 font-medium max-w-sm leading-relaxed">Everything you need to know about monetization, licensing, and access.</p>
              </div>
              <div className="space-y-3">
                {faqItems.map((item) => (
                  <details key={item.q} className="group cursor-pointer bg-white border border-black/[0.04] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/[0.03] hover:-translate-y-0.5">
                    <summary className="flex items-center justify-between p-6 list-none outline-none">
                      <span className="text-base md:text-lg font-bold text-black tracking-tight pr-4">{item.q}</span>
                      <div className="transition-transform duration-500 group-open:rotate-180 opacity-40">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-sm text-black/60 leading-relaxed max-w-xl">{item.a}</div>
                  </details>
                ))}
                <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                  <button className="flex items-center justify-center gap-2 bg-black text-white px-7 py-3 rounded-xl font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-black/90 transition-all shadow-xl group">
                    Load more
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="group-hover:translate-y-0.5 transition-transform">
                      <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p className="text-[11px] text-black/30 font-bold tracking-tight">
                    Need specialized help?{" "}
                    <Link href="/contact" className="text-black underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">
                      Support Desk
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="w-full relative overflow-hidden py-40 bg-[#000000] border-t border-white/5 font-body">
        <div className="absolute inset-0 z-0 h-full w-full">
          <div className="absolute inset-0 bg-[#0A0A0A] z-10" />
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#7CFF00]/10 blur-[140px] z-10 rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-white/5 blur-[120px] z-10 rounded-full" />
          <img
            src="https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2670&auto=format&fit=crop"
            alt="CTA Visual"
            className="w-full h-full object-cover opacity-20 grayscale scale-110 relative z-0"
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-[85px] font-black uppercase leading-[0.85] tracking-[-0.04em] text-white mb-10">
              Ready to amplify <br />
              <span className="text-[#7CFF00] italic pr-2">your vision?</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-normal leading-relaxed mb-16 max-w-xl mx-auto tracking-wide">
              Join thousands of creators using Tracknit to find the perfect sound for their stories.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/login"
                className="bg-[#7CFF00] text-black px-10 py-[18px] rounded-full font-bold uppercase tracking-[0.1em] text-[12px] hover:scale-[1.05] transition-all shadow-[0_20px_40px_-5px_rgba(124,255,0,0.4)] inline-block text-center min-w-[190px]"
              >
                Get Started Now
              </Link>
              <Link
                href="/pricing"
                className="bg-white text-black px-10 py-[18px] rounded-full font-bold uppercase tracking-[0.1em] text-[12px] hover:scale-[1.05] transition-all shadow-xl inline-block text-center min-w-[190px]"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
