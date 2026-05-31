import Link from "next/link";
import React from "react";

const routes = [
  { path: "/", name: "Home" },
  { path: "/login", name: "Login" },
  { path: "/register", name: "Register" },
  { path: "/pricing", name: "Pricing" },
  { path: "/pricing/success", name: "Pricing Success Polling" },
  { path: "/library/royalty-free-music", name: "Library - Music" },
  { path: "/library/sound-effects", name: "Library - SFX" },
  { path: "/library/liked", name: "Library - Favorites" },
  { path: "/library/downloads", name: "Library - Downloads" },
  { path: "/library/collections", name: "Library - Collections" },
  { path: "/library/whitelist", name: "Library - Whitelist Dashboard" },
  { path: "/api/auth/signin", name: "NextAuth Default Sign In (Testing)" },
];

export default function TestRoutesPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-widest text-[#7CFF00] mb-2">
          Test Navigation
        </h1>
        <p className="text-white/50 mb-10 text-sm">
          A development utility to quickly jump between all active routes in the application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="flex items-center justify-between bg-[#181818] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all group"
            >
              <span className="font-bold text-sm text-white group-hover:text-[#7CFF00] transition-colors">
                {route.name}
              </span>
              <span className="text-xs font-mono text-white/30 group-hover:text-white/50">
                {route.path}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
