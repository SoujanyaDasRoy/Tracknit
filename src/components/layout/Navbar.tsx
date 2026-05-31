"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/library/royalty-free-music", label: "Music" },
  { href: "/library/sound-effects", label: "Sound Effects" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  const isHome = pathname === "/";
  const shouldShowSolidNav = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[9999] border-b transition-all duration-300 font-body font-normal text-white ${shouldShowSolidNav ? "border-white/5 bg-black/60 shadow-lg shadow-black/20" : "border-transparent bg-transparent"}`}
        style={{ backdropFilter: shouldShowSolidNav ? "blur(12px)" : "none", WebkitBackdropFilter: shouldShowSolidNav ? "blur(12px)" : "none" }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: shouldShowSolidNav ? 0.05 : 0,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="flex justify-between items-center px-6 py-3 max-w-[1440px] mx-auto relative z-10">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center shrink-0">
              <img alt="Tracknit" className="h-[38px] w-auto object-contain" src="/logo-header.png" />
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest transition-colors block ${pathname === link.href ? "text-[#7CFF00]" : "text-white/80 hover:text-[#7CFF00]"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {session ? (
              <button
                onClick={() => signOut()}
                className="hidden md:block bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-lg"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:block bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-lg"
              >
                Get Started
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] z-[10000] bg-[#0f141b] border-l border-white/[0.07] md:hidden flex flex-col"
            >
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-4 pb-8 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-4 text-sm font-medium uppercase tracking-widest border-b border-white/[0.05] transition-colors ${pathname === link.href ? "text-[#7CFF00]" : "text-white/70 hover:text-white"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  {session ? (
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="w-full bg-[#7CFF00] text-black px-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs text-center"
                    >
                      Log Out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full bg-white text-black px-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs text-center"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
