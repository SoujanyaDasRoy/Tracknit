"use client";

import Link from "next/link";

export default function Footer() {
  const footerColumns = [
    {
      title: "Product",
      links: [
        { label: "Music", href: "/library/royalty-free-music" },
        { label: "Sound Effects", href: "/library/sound-effects" },
        { label: "Account", href: "/account" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Learn More",
      links: [
        { label: "How it Works", href: "/how-it-works" },
        { label: "In-store Music", href: "/in-store" },
        { label: "Enterprise", href: "/enterprise" },
        { label: "Customer Stories", href: "/stories" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Help Centre", href: "/help" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Licensing", href: "/licensing" },
      ],
    },
  ];
  const socialLinks = [
    { name: "Spotify", href: "#", icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { name: "Instagram", href: "#", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
    { name: "Facebook", href: "#", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" },
    { name: "X", href: "#", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" },
  ];

  return (
    <footer className="w-full bg-[#000000] relative overflow-hidden border-t border-white/5 pb-10 pt-16 font-body text-white">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#7CFF00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <img
              alt="Tracknit"
              className="h-[38px] w-auto mb-6 object-contain"
              src="/logo.svg"
            />
            <p className="text-white/90 text-sm font-normal leading-relaxed max-w-xs">
              Royalty-free music and sound effects for creators. Cleared for every platform.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title} className="md:border-l md:border-white/[0.03] md:pl-8">
              <h4 className="text-white font-bold uppercase text-[10px] tracking-[0.3em] mb-7">{column.title}</h4>
              <ul className="space-y-3.5 list-none p-0">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link href={link.href} className="text-white/60 hover:text-white text-[13px] font-normal transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-normal uppercase tracking-widest text-white/90">
              © {new Date().getFullYear()} TracKnit
            </span>
            <div className="flex gap-4">
              <Link href="/terms" className="text-[10px] font-normal uppercase tracking-widest text-white/90 hover:text-[#7CFF00] transition-colors">
                Legal
              </Link>
              <Link href="/privacy" className="text-[10px] font-normal uppercase tracking-widest text-white/90 hover:text-[#7CFF00] transition-colors">
                Privacy
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} className="opacity-50 hover:opacity-100 transition-all hover:-translate-y-1">
                  <img
                    className={`h-4 w-auto ${social.name === "X" ? "invert" : ""}`}
                    src={social.icon}
                    alt={social.name}
                    title={social.name}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
