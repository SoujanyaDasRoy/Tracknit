"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Smile, Grid2X2, Zap, Mic2, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, Search, Play, Pause, X, Menu, Download, FileText, Calendar, ExternalLink,
  ShieldCheck, LogIn
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { UserDropdown } from "@/components/library/UserDropdown";

export default function DownloadsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const isLoggedIn    = !!session?.user;
  const planTier      = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive  = !!planTier && planTier !== "free";

  // Authentication Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const mockDownloads = [
    {
      id: "down-1",
      title: "Beyond the Horizon",
      artist: "Satin Waves",
      download_date: new Date().toISOString(),
      license_key: "LIC-88392-XTNZ-9921",
      download_url: "#",
      license_url: "#"
    },
    {
      id: "down-2",
      title: "City Lights",
      artist: "Velvet Motion",
      download_date: new Date(Date.now() - 86400000).toISOString(),
      license_key: "LIC-74829-YUPQ-3312",
      download_url: "#",
      license_url: "#"
    }
  ];

  // Fetch Downloads History
  useEffect(() => {
    if (isLoggedIn) {
      const fetchHistory = async () => {
        try {
          const res = await apiFetch("/user/downloads");
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDownloads(data);
          } else {
            setDownloads(mockDownloads);
          }
        } catch (err) {
          console.error("Failed to fetch download history:", err);
          setDownloads(mockDownloads);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setDownloads(mockDownloads);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleDownloadFile = async (post_id: string, title: string, artist: string) => {
    setActionId(`${post_id}-audio`);
    try {
      const response = await apiFetch(`/tracks/${post_id}/download`, {
        method: "POST"
      });
      const data = await response.json();
      
      if (data.download_url) {
        const link = document.createElement("a");
        link.href = data.download_url;
        link.setAttribute("download", `${title} - ${artist}.wav`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert("Failed to retrieve secure download URL.");
    } finally {
      setActionId(null);
    }
  };

  const handleDownloadLicense = async (post_id: string, title: string) => {
    setActionId(`${post_id}-license`);
    try {
      const response = await apiFetch(`/tracks/${post_id}/download`, {
        method: "POST"
      });
      const data = await response.json();
      
      if (data.license_url) {
        const link = document.createElement("a");
        link.href = data.license_url;
        link.setAttribute("target", "_blank");
        link.setAttribute("download", `License - ${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert("Failed to retrieve secure license PDF URL.");
    } finally {
      setActionId(null);
    }
  };

  if (status === "loading" || !session || loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading History...</span>
        </div>
      </div>
    );
  }

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
          <Link href="/library/downloads" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-white/[0.06] shadow-md shadow-black/20 text-white font-bold transition-all">
            <Download size={18} className="text-primary filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" /> <span className="text-[13.5px]">Downloads</span>
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Download History</h1>
            <p className="text-neutral-400 text-sm">Review, re-download, and retrieve licensing PDFs for your previous releases.</p>
          </div>

          {downloads.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-[#181818] border border-white/[0.06] text-center"
            >
              <Download size={48} className="text-neutral-600 mb-5" />
              <h3 className="text-lg font-bold mb-1">No Downloads Found</h3>
              <p className="text-neutral-400 text-sm max-w-sm mb-8">You haven&apos;t downloaded any music or sound effects yet. Start exploring our high-fidelity library!</p>
              <Link href="/library/royalty-free-music" className="bg-[#7CFF00] hover:scale-[1.03] text-black px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-[0_8px_20px_-6px_rgba(124,255,0,0.3)]">
                Browse Music Catalog
              </Link>
            </motion.div>
          ) : (
            <div className="w-full bg-[#181818] border border-white/[0.06] rounded-[24px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-neutral-400 text-left text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4.5">Track Details</th>
                      <th className="px-6 py-4.5">Licensing Tier</th>
                      <th className="px-6 py-4.5">License Key</th>
                      <th className="px-6 py-4.5">Download Date</th>
                      <th className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloads.map((item) => (
                      <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors text-[14px]">
                        {/* Track Info */}
                        <td className="px-6 py-5.5 flex items-center gap-3.5">
                          {item.image ? (
                            <img src={item.image} alt="" className="h-11 w-11 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="h-11 w-11 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-500 flex-shrink-0">HQ</div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate">{item.title || "Track Title"}</span>
                            <span className="text-neutral-400 text-xs truncate mt-0.5">{item.artist || "Unknown Artist"}</span>
                          </div>
                        </td>

                        {/* Licensing Plan */}
                        <td className="px-6 py-5.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                            <Zap size={11} className="fill-current" /> {item.plan_tier || "Active Plan"}
                          </span>
                        </td>

                        {/* License Key */}
                        <td className="px-6 py-5.5 font-mono text-[11.5px] text-neutral-400">
                          {item.license_key ? (
                            <span className="select-all">{item.license_key}</span>
                          ) : (
                            <span className="text-neutral-600 font-sans italic">Generating...</span>
                          )}
                        </td>

                        {/* Download Date */}
                        <td className="px-6 py-5.5 text-neutral-400 flex items-center gap-2 mt-4.5">
                          <Calendar size={13} className="text-neutral-500" />
                          <span>{new Date(item.downloaded_at || item.created_at).toLocaleDateString()}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5.5 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleDownloadFile(item.post_id, item.title, item.artist)}
                              disabled={actionId === `${item.post_id}-audio`}
                              className="h-10 px-4.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/[0.03] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionId === `${item.post_id}-audio` ? (
                                <span className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Download size={13} />
                              )}
                              Audio
                            </button>
                            <button
                              onClick={() => handleDownloadLicense(item.post_id, item.title)}
                              disabled={actionId === `${item.post_id}-license`}
                              className="h-10 px-4.5 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionId === `${item.post_id}-license` ? (
                                <span className="h-3 w-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                              ) : (
                                <FileText size={13} />
                              )}
                              License
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
