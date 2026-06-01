"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { UserDropdown } from "@/components/library/UserDropdown";
import { apiFetch } from "@/lib/api-client";
import {
  Smile, Grid2X2, Zap, Mic2, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, Play, Pause, X, Menu, Download, ShieldCheck, LogIn, ArrowRight
} from "lucide-react";

const PLAYLISTS = [
  { title: "Tracknit Sessions", desc: "Curated weekly picks from our team.", tracks: 50, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80" },
  { title: "Cinematic Vibes", desc: "Epic and emotional music for your stories.", tracks: 45, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80" },
  { title: "Chill & Focus", desc: "Lo-fi, chillhop and calm beats.", tracks: 37, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80" },
  { title: "Urban Flow", desc: "Modern hip-hop and street vibes.", tracks: 40, image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&q=80" },
  { title: "Uplifting Anthems", desc: "Inspiring and energetic tracks to uplift.", tracks: 42, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80" },
  { title: "Indie Chillout", desc: "Acoustic indie songs for relaxing edits.", tracks: 29, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80" }
];

export default function CollectionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn    = !!session?.user;
  const planTier      = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive  = !!planTier && planTier !== "free";

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const response = await apiFetch("/playlists");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPlaylists(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch playlists from WordPress API:", err);
      }
      setPlaylists(PLAYLISTS);
      setLoading(false);
    }
    loadPlaylists();
  }, []);

  return (
    <div className="flex bg-[#111111] text-white font-sans min-h-screen">
      {/* ═══════════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════════ */}
      <aside className={`w-[260px] flex-shrink-0 flex flex-col h-screen bg-[#181818] border-r border-white/[0.07] fixed top-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-[64px] px-6 flex items-center justify-between shrink-0 border-b border-white/[0.07]">
          <Link href="/">
            <img alt="Tracknit" className="h-[36px] w-auto object-contain" src="/logo.svg" />
          </Link>
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <Link href="/library/royalty-free-music" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Music size={18} /> <span className="text-[13.5px]">Royalty-Free Music</span>
          </Link>
          <Link href="/library/sound-effects" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Zap size={18} /> <span className="text-[13.5px]">Sound Effects</span>
          </Link>
          <Link href="/library/liked" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Smile size={18} /> <span className="text-[13.5px]">Liked</span>
          </Link>
          <Link href="/library/downloads" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Download size={18} /> <span className="text-[13.5px]">Downloads</span>
          </Link>
          <Link href="/library/collections" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-white/[0.06] shadow-md shadow-black/20 text-white font-bold transition-all">
            <ListMusic size={18} className="text-primary filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" /> <span className="text-[13.5px]">Collections</span>
          </Link>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════ */}
      <div className="flex-grow lg:pl-[260px] flex flex-col min-h-screen w-full">
        {/* TOP NAV */}
        <header className="h-[64px] flex items-center justify-between px-6 lg:px-10 bg-[#181818]/95 backdrop-blur-md border-b border-white/[0.07] sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <button className="lg:hidden text-white/50 hover:text-white mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {isLoggedIn ? (
                <Link href="/my-account" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Dashboard</Link>
              ) : (
                <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Discover</Link>
              )}
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Music</Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Sound Effects</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* ── Situation 1: Not logged in ── */}
            {!isLoggedIn && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">
                  Pricing
                </Link>
                <Link href="/login" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="h-9 px-5 bg-white hover:bg-[#7CFF00] text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  Get Started
                </Link>
              </>
            )}

            {/* ── Situation 2: Logged in, not subscribed (Free) ── */}
            {isLoggedIn && !isPlanActive && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">
                  Pricing
                </Link>
                <Link href="/pricing" className="h-9 px-5 bg-white hover:bg-[#7CFF00] text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  Subscribe
                </Link>
                <UserDropdown planTier={planTier} />
              </>
            )}

            {/* ── Situation 3: Logged in + subscribed ── */}
            {isLoggedIn && isPlanActive && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors mr-2">
                  Pricing
                </Link>
                <Link href="/library/liked" className="h-9 px-5 bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  My Library
                </Link>
                <UserDropdown planTier={planTier} />
              </>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1500px] mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Curated Collections</h1>
            <p className="text-neutral-400 text-sm">Curated playlists and album compilations made by music professionals for rapid visual editing.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-[280px] rounded-3xl bg-[#181818] border border-white/[0.06] p-4 animate-pulse flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="aspect-video rounded-2xl bg-white/5 w-full" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                  <div className="h-4 bg-white/5 rounded w-1/3 pt-3 border-t border-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {playlists.map((pl) => (
                <motion.div
                  key={pl.title}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group cursor-pointer rounded-3xl bg-[#181818] border border-white/[0.06] hover:bg-[#202020] transition-all p-4 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Playlist cover box */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/[0.06]">
                      <img src={pl.image} alt={pl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                          <Play className="h-5 w-5 text-black fill-black translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">{pl.title}</h3>
                    <p className="text-neutral-400 text-xs font-medium leading-relaxed mb-4">{pl.desc || pl.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[12px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-primary transition-colors">
                    <span>{pl.tracks || pl.count || "Curated"} Curated Tracks</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Minimal stub for UI compatibility
const DropdownMenu = ({ children }: any) => <div className="relative">{children}</div>;
const DropdownMenuTrigger = ({ children, className }: any) => <button className={className}>{children}</button>;
const DropdownMenuContent = ({ children, align }: any) => <div className="absolute right-0 mt-2 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 w-40">{children}</div>;
const DropdownMenuItem = ({ children, onClick, className }: any) => <button onClick={onClick} className={`w-full text-left ${className}`}>{children}</button>;
