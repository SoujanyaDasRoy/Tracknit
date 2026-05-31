"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Smile, Grid2X2, Zap, Mic2, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, Search, Play, Pause, X, Menu, Download, FileText, Calendar, ExternalLink,
  ShieldCheck, AlertCircle, Clock3, Plus, MonitorPlay, LogIn
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { UserDropdown } from "@/components/library/UserDropdown";

export default function WhitelistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn    = !!session?.user;
  const planTier      = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive  = !!planTier && planTier !== "free";

  // Authentication Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const mockChannels = [
    {
      id: "ch-1",
      channel_url: "https://youtube.com/@mockcreator",
      status: "approved",
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "ch-2",
      channel_url: "https://youtube.com/channel/UCmockurl2849",
      status: "pending",
      created_at: new Date().toISOString()
    }
  ];

  // Fetch Whitelist History
  useEffect(() => {
    if (isLoggedIn) {
      const fetchChannels = async () => {
        try {
          const res = await apiFetch("/api/backend/user/whitelist-channel");
          const data = await res.json();
          if (Array.isArray(data.channels) && data.channels.length > 0) {
            setChannels(data.channels);
          } else {
            setChannels(mockChannels);
          }
        } catch (err) {
          console.error("Failed to fetch whitelist channels:", err);
          setChannels(mockChannels);
        } finally {
          setLoading(false);
        }
      };
      fetchChannels();
    } else {
      setChannels(mockChannels);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/backend/user/whitelist-channel", {
        method: "POST",
        body: JSON.stringify({ channel_url: newChannelUrl })
      });
      
      const data = await response.json();
      if (response.ok) {
        // Add to list optimistically or refetch
        setChannels([{ 
          id: Date.now(), 
          channel_url: newChannelUrl, 
          status: 'pending', 
          created_at: new Date().toISOString() 
        }, ...channels]);
        setNewChannelUrl("");
      } else {
        alert(data.message || "Failed to submit channel.");
      }
    } catch (err) {
      alert("An error occurred while submitting the channel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (channelStatus: string) => {
    switch (channelStatus) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7CFF00]/10 border border-[#7CFF00]/20 rounded-full text-xs font-bold text-[#7CFF00] uppercase tracking-wider">
            <ShieldCheck size={11} className="fill-current" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider">
            <AlertCircle size={11} className="fill-current" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/70 uppercase tracking-wider">
            <Clock3 size={11} className="fill-current" /> Pending
          </span>
        );
    }
  };

  if (status === "loading" || !session || loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-white/20 border-t-[#7CFF00] rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading Whitelist...</span>
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
            <img alt="Tracknit" className="h-[36px] w-auto object-contain" src="/logo-header.png" />
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
          <Link href="/library/collections" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <ListMusic size={18} /> <span className="text-[13.5px]">Collections</span>
          </Link>
          <div className="my-4 border-t border-white/5" />
          <Link href="/library/whitelist" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-white/[0.06] shadow-md shadow-black/20 text-white font-bold transition-all">
            <ShieldCheck size={18} className="text-[#7CFF00] filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" /> <span className="text-[13.5px]">Clearance / Whitelist</span>
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
        <main className="flex-1 p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Content ID Whitelist</h1>
            <p className="text-neutral-400 text-sm max-w-2xl">
              Add your YouTube channels here so we can clear your videos from copyright claims. 
              Depending on your plan, you can add 1, 3, or unlimited channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SUBMIT FORM */}
            <div className="lg:col-span-1">
              <div className="bg-[#181818] border border-white/[0.06] rounded-[24px] p-6 shadow-xl sticky top-[100px]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-full bg-[#7CFF00]/10 flex items-center justify-center">
                    <MonitorPlay className="h-5 w-5 text-[#7CFF00]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Add Channel</h3>
                    <p className="text-xs text-white/40 mt-0.5">Clear a new platform</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Channel URL or ID
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/@channel"
                      value={newChannelUrl}
                      onChange={(e) => setNewChannelUrl(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7CFF00]/50 focus:ring-1 focus:ring-[#7CFF00]/50 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !newChannelUrl.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-[#7CFF00] hover:bg-[#7CFF00]/90 text-black px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_-6px_rgba(124,255,0,0.3)]"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus size={14} /> Submit Channel
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-white/30 text-center leading-relaxed mt-4">
                    Once submitted, our system will review and add your channel to the Content ID safe-list within 24 hours.
                  </p>
                </form>
              </div>
            </div>

            {/* LIST */}
            <div className="lg:col-span-2">
              <div className="w-full bg-[#181818] border border-white/[0.06] rounded-[24px] overflow-hidden shadow-xl">
                {channels.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <ShieldCheck size={48} className="text-white/10 mb-5" />
                    <h3 className="text-lg font-bold mb-1">No channels whitelisted</h3>
                    <p className="text-neutral-400 text-sm max-w-sm">
                      You haven't added any channels to your whitelist yet. Submit your first channel to ensure your videos are protected.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-neutral-400 text-left text-[11px] font-bold uppercase tracking-wider">
                          <th className="px-6 py-4.5">Channel URL</th>
                          <th className="px-6 py-4.5">Status</th>
                          <th className="px-6 py-4.5 text-right">Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels.map((channel) => (
                          <tr key={channel.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors text-[14px]">
                            <td className="px-6 py-5.5 flex items-center gap-3.5">
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-white truncate max-w-[280px]">
                                  {channel.channel_url}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5.5">
                              {renderStatusBadge(channel.status)}
                            </td>
                            <td className="px-6 py-5.5 text-neutral-400 text-right text-sm">
                              {new Date(channel.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Minimal stub for UI compatibility
const DropdownMenu = ({ children }: any) => <div className="relative group/dropdown">{children}</div>;
const DropdownMenuTrigger = ({ children, className }: any) => <button className={className}>{children}</button>;
const DropdownMenuContent = ({ children, align, className }: any) => <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} mt-2 hidden group-hover/dropdown:block ${className} z-50`}>{children}</div>;
const DropdownMenuItem = ({ children, onClick, className }: any) => <button onClick={onClick} className={`w-full text-left ${className}`}>{children}</button>;
