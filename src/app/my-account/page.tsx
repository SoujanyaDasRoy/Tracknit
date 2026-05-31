"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Crown, 
  Music, 
  Zap, 
  Heart, 
  Download, 
  ListMusic, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { UserDropdown } from "@/components/library/UserDropdown";

const getPlanDisplayName = (tier?: string) => {
  if (!tier) return "Free Tier";
  switch (tier.toLowerCase()) {
    case "pro": return "Pro Plan";
    case "creator": return "Creator Plan";
    case "basic": return "Basic Plan";
    default: return `${tier.charAt(0).toUpperCase()}${tier.slice(1)} Plan`;
  }
};

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication Redirect Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-white/20 border-t-[#7CFF00] rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading Account...</span>
        </div>
      </div>
    );
  }

  const planTier = (session.user as any).planTier || "free";
  const planName = getPlanDisplayName(planTier);
  const isPaid = planTier.toLowerCase() !== "free";
  const roleName = (session.user as any).role || "subscriber";

  return (
    <div className="flex bg-[#111111] text-white font-sans min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════════ */}
      <aside className={`w-[260px] flex-shrink-0 flex flex-col h-screen bg-[#181818] border-r border-white/[0.07] fixed top-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-[64px] px-6 flex items-center justify-between shrink-0 border-b border-white/[0.07]">
          <Link href="/">
            <img alt="Tracknit" className="h-[36px] w-auto object-contain" src="/logo-header.png" />
          </Link>
          <button className="lg:hidden text-white/40 hover:text-white cursor-pointer" onClick={() => setSidebarOpen(false)}>
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
            <Heart size={18} /> <span className="text-[13.5px]">Liked</span>
          </Link>
          <Link href="/library/downloads" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Download size={18} /> <span className="text-[13.5px]">Downloads</span>
          </Link>
          <Link href="/library/collections" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <ListMusic size={18} /> <span className="text-[13.5px]">Collections</span>
          </Link>
          <div className="my-4 border-t border-white/5" />
          <Link href="/library/whitelist" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <ShieldCheck size={18} /> <span className="text-[13.5px]">Clearance / Whitelist</span>
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
            <button className="lg:hidden text-white/50 hover:text-white mr-4 cursor-pointer" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {session?.user ? (
                <Link href="/my-account" className="text-xs uppercase tracking-widest font-body font-normal text-[#7CFF00] transition-colors">Dashboard</Link>
              ) : (
                <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Discover</Link>
              )}
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Music</Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Sound Effects</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hidden sm:block text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Pricing</Link>
            <UserDropdown />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {/* Header Title */}
          <div className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">My Account</h1>
            <p className="text-neutral-400 text-sm">Manage your profile, active plans, download history, and licensing certificates.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Profile Overview */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Profile Details Card */}
              <div className="relative rounded-3xl overflow-hidden bg-[#18181a] border border-white/[0.06] p-8 shadow-xl">
                {/* Glowing subtle light behind */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7CFF00]/5 rounded-full blur-[100px] pointer-events-none select-none" />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                  {/* Large Avatar container */}
                  <div className="h-20 w-20 rounded-2xl bg-neutral-800 border-2 border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-white/40" />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-3.5">
                      <h2 className="text-2xl font-bold tracking-tight text-white leading-none">
                        {session.user?.name || "Tracknit Creator"}
                      </h2>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7CFF00]/10 border border-[#7CFF00]/25 text-[#7CFF00] text-[10px] font-black uppercase tracking-widest">
                          <Crown className="h-3 w-3" />
                          {planName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 text-[10px] font-black uppercase tracking-widest">
                          {planName}
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mt-2 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-white/40 shrink-0" />
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/[0.06] mt-8 pt-8 relative z-10 text-sm">
                  <div className="space-y-1">
                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider block">Plan Status</span>
                    <span className="text-white font-semibold flex items-center gap-1.5 mt-1">
                      <span className={`h-2 w-2 rounded-full ${isPaid ? "bg-[#7CFF00]" : "bg-neutral-500"}`} />
                      {isPaid ? "Active & Cleared" : "Free - Standard Limits"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider block">Account Role</span>
                    <span className="text-white font-semibold flex items-center gap-1.5 mt-1 capitalize">
                      <Shield className="h-4 w-4 text-white/40" />
                      {roleName}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider block">Member Since</span>
                    <span className="text-white font-semibold flex items-center gap-1.5 mt-1">
                      <Calendar className="h-4 w-4 text-white/40" />
                      May 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Settings & Help */}
              <div className="rounded-3xl bg-[#18181a] border border-white/[0.06] p-8 shadow-xl">
                <h3 className="text-lg font-bold tracking-tight text-white mb-6">Account Services</h3>
                
                <div className="divide-y divide-white/[0.06] text-sm">
                  <div className="py-4.5 flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#7CFF00] transition-colors">Subscription Manager</h4>
                      <p className="text-neutral-400 text-xs mt-1">Check invoice history, cancel or renew subscription plans.</p>
                    </div>
                    <Link href="/pricing" className="h-8 w-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors text-white/60 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="py-4.5 flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#7CFF00] transition-colors">YouTube Clearance Status</h4>
                      <p className="text-neutral-400 text-xs mt-1">Add or clear channel URLs from copyright system.</p>
                    </div>
                    <Link href="/library/whitelist" className="h-8 w-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors text-white/60 hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="py-4.5 flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#7CFF00] transition-colors">Support & Help Center</h4>
                      <p className="text-neutral-400 text-xs mt-1">Have trouble with clearance or downloads? Talk to support.</p>
                    </div>
                    <Link href="/contact" className="h-8 w-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors text-white/60 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Grid / Dashboard Links */}
            <div className="space-y-6">
              
              {/* Card: Liked/Favorites */}
              <Link href="/library/liked" className="block group">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1b1b1f] to-[#121214] border border-white/[0.06] hover:border-white/15 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/20 transition-all">
                      <Heart className="h-5 w-5 text-white/60 group-hover:text-[#7CFF00] transition-colors" />
                    </div>
                    <h3 className="font-bold text-[15px] uppercase tracking-wider text-white">Favorites</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    Access and listen to all your curated favorite tracks and collections in one clean layout.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 group-hover:text-white font-bold transition-all uppercase tracking-widest">
                    <span>View Liked Music</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Card: Downloads */}
              <Link href="/library/downloads" className="block group">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1b1b1f] to-[#121214] border border-white/[0.06] hover:border-white/15 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/20 transition-all">
                      <Download className="h-5 w-5 text-white/60 group-hover:text-[#7CFF00] transition-colors" />
                    </div>
                    <h3 className="font-bold text-[15px] uppercase tracking-wider text-white">Downloads</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    Re-download WAV tracks or fetch PDF license agreements for your active channels.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 group-hover:text-white font-bold transition-all uppercase tracking-widest">
                    <span>View Downloads</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Card: YouTube Whitelist */}
              <Link href="/library/whitelist" className="block group">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1b1b1f] to-[#121214] border border-white/[0.06] hover:border-white/15 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/20 transition-all">
                      <ShieldCheck className="h-5 w-5 text-white/60 group-hover:text-[#7CFF00] transition-colors" />
                    </div>
                    <h3 className="font-bold text-[15px] uppercase tracking-wider text-white">Clearance Whitelist</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    Add your YouTube channel URL to whitelist to automatically avoid copyright claims.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 group-hover:text-white font-bold transition-all uppercase tracking-widest">
                    <span>Clear Channel</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Card: Billing & Pricing */}
              <Link href="/pricing" className="block group">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1b1b1f] to-[#121214] border border-white/[0.06] hover:border-white/15 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-[#7CFF00]/10 group-hover:border-[#7CFF00]/20 transition-all">
                      <CreditCard className="h-5 w-5 text-white/60 group-hover:text-[#7CFF00] transition-colors" />
                    </div>
                    <h3 className="font-bold text-[15px] uppercase tracking-wider text-white">Plans & Upgrades</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    Unlock full commercial releases and cleared downloads by upgrading your active plan.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 group-hover:text-white font-bold transition-all uppercase tracking-widest">
                    <span>Check Plans</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
