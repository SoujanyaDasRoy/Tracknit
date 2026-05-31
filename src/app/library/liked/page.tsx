"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile, Zap, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, Search, Play, Pause, X, Menu, Download, FileText, Calendar, ExternalLink,
  ShieldCheck, LogIn, Heart, HeartOff, Crown, Sparkles
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { usePlayerStore } from "@/store/usePlayerStore";
import { UserDropdown } from "@/components/library/UserDropdown";
import { TrackRow } from "@/components/library/TrackRow";
import { type LibraryTrack } from "@/lib/library-r2";

export default function LikedPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [likedTracks, setLikedTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const isLoggedIn    = !!session?.user;
  const planTier      = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive  = !!planTier && planTier !== "free";

  const { 
    activeTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    likedTrackIds, 
    toggleLike 
  } = usePlayerStore();

  // Authentication Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const mockFavorites = [
    {
      id: "horizon",
      kind: "music",
      title: "Beyond the Horizon",
      artist: "Satin Waves",
      genre: ["Cinematic"],
      bpm: 92,
      keySig: "Db Maj",
      duration: "2:40",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      moods: ["Inspiring"]
    },
    {
      id: "city-lights",
      kind: "music",
      title: "City Lights",
      artist: "Velvet Motion",
      genre: ["Lo-Fi Hip Hop"],
      bpm: 80,
      keySig: "F Min",
      duration: "2:30",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      moods: ["Chill"]
    }
  ];

  // Fetch Liked Tracks from WP API
  useEffect(() => {
    if (isLoggedIn) {
      const fetchLiked = async () => {
        try {
          const res = await apiFetch("/user/favorites");
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLikedTracks(data);
          } else {
            setLikedTracks(mockFavorites);
          }
        } catch (err) {
          console.error("Failed to fetch liked tracks:", err);
          setLikedTracks(mockFavorites);
        } finally {
          setLoading(false);
        }
      };
      fetchLiked();
    } else {
      setLikedTracks(mockFavorites);
      setLoading(false);
    }
  }, [isLoggedIn, likedTrackIds]);

  const handlePlayToggle = (track: any) => {
    const isCurrent = activeTrack?.id === track.id.toString();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack({
        id: track.id.toString(),
        title: track.title || "Untitled Track",
        artist: track.artist || "Unknown Artist",
        genre: track.genre || ["Cinematic"],
        bpm: track.bpm || 120,
        keySig: track.key || "C",
        duration: track.duration || "3:00",
        image: track.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        audioUrl: track.audioUrl || track.meta?._tracknit_preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        waveform: track.waveform
      });
    }
  };

  const handleDownload = async (track: any) => {
    if (downloadingId) return;
    setDownloadingId(track.id.toString());
    try {
      const response = await apiFetch(`/tracks/${track.id}/download`, {
        method: "POST"
      });
      const data = await response.json();

      if (data.download_url) {
        const audioLink = document.createElement("a");
        audioLink.href = data.download_url;
        audioLink.setAttribute("download", `${track.title} - ${track.artist}.wav`);
        document.body.appendChild(audioLink);
        audioLink.click();
        document.body.removeChild(audioLink);
      }

      if (data.license_url) {
        setTimeout(() => {
          const licenseLink = document.createElement("a");
          licenseLink.href = data.license_url;
          licenseLink.setAttribute("target", "_blank");
          licenseLink.setAttribute("download", `License - ${track.title}.pdf`);
          document.body.appendChild(licenseLink);
          licenseLink.click();
          document.body.removeChild(licenseLink);
        }, 800);
      }
    } catch (err: any) {
      alert(err.message || "Failed to download track. Check subscription.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleUnheart = async (trackId: string) => {
    try {
      await toggleLike(trackId);
      // Immediately filter it out locally for snappy visual response
      setLikedTracks(prev => prev.filter(t => (t.post_id || t.id).toString() !== trackId));
    } catch (err) {
      alert("Failed to remove track from liked list.");
    }
  };

  if (status === "loading" || !session || loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading Favorites...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#111111] text-white font-sans min-h-screen">
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

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
          <Link href="/library/liked" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-white/[0.06] shadow-md shadow-black/20 text-white font-bold transition-all">
            <Smile size={18} className="text-primary filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" /> <span className="text-[13.5px]">Liked</span>
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

        {/* Account Menu Footer (Static at bottom of sidebar) */}
        {isLoggedIn && (
          <div className="shrink-0 border-t border-white/[0.06] bg-[#181818] p-3.5">
            <UserDropdown variant="sidebar" planTier={planTier} />
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════ */}
      <div className="flex-grow lg:pl-[260px] flex flex-col min-h-screen w-full">
        {/* TOP NAV */}
        <header className="h-[64px] flex items-center justify-between px-6 lg:px-10 bg-[#181818]/95 backdrop-blur-md border-b border-white/[0.07] fixed top-0 left-0 lg:left-[260px] right-0 z-40">
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
        <main className="flex-1 px-2 py-6 lg:px-4 lg:py-8 max-w-[1720px] mx-auto w-full pt-[64px]">
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Favorites</h1>
            <p className="text-neutral-400 text-sm font-medium">Your personally curated tracks and sounds, kept sync&apos;d cleared and royalty-free.</p>
          </div>

          {likedTracks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-[#181818] border border-white/[0.06] text-center"
            >
              <Heart size={48} className="text-neutral-600 mb-5 animate-pulse" />
              <h3 className="text-lg font-bold mb-1">No Liked Tracks Yet</h3>
              <p className="text-neutral-400 text-sm max-w-sm mb-8">Click the heart icon on any track or sound effect to add it to your library dashboard.</p>
              <Link href="/library/royalty-free-music" className="bg-[#7CFF00] hover:scale-[1.03] text-black px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-[0_8px_20px_-6px_rgba(124,255,0,0.3)]">
                Explore Tracks
              </Link>
            </motion.div>
          ) : (
            <div className="w-full">
              
              <AnimatePresence>
                {likedTracks.filter((item) => !!item.image && item.image.trim() !== "").map((item) => {
                  const trackId = (item.post_id || item.id).toString();
                  const normalizedTrack: LibraryTrack = {
                    id: trackId,
                    title: item.title || "Untitled Track",
                    artist: item.artist || "Unknown Artist",
                    genre: Array.isArray(item.genre) ? item.genre : [item.genre || "Cinematic"],
                    bpm: item.bpm || 110,
                    keySig: item.keySig || "Am",
                    duration: item.duration || "3:00",
                    image: item.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
                    audioUrl: item.audioUrl || item.meta?._tracknit_preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    kind: item.post_type === "tn_sfx" ? "sfx" : "music",
                    waveform: item.waveform
                  };

                  const isLiked = likedTrackIds.includes(trackId);

                  return (
                    <motion.div
                      key={trackId}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TrackRow
                        track={normalizedTrack}
                        activeTrack={activeTrack}
                        isPlaying={isPlaying}
                        isLiked={isLiked}
                        onPlayToggle={handlePlayToggle}
                        onHeartClick={handleUnheart}
                        onDownload={handleDownload}
                        allTracks={likedTracks.map(t => ({
                          id: (t.post_id || t.id).toString(),
                          title: t.title || "Untitled",
                          artist: t.artist || "Unknown",
                          genre: Array.isArray(t.genre) ? t.genre : [t.genre || "Cinematic"],
                          bpm: t.bpm || 110,
                          keySig: t.keySig || "Am",
                          duration: t.duration || "3:00",
                          image: t.image || "",
                          audioUrl: t.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                          kind: t.post_type === "tn_sfx" ? "sfx" : "music",
                          waveform: t.waveform
                        }))}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
