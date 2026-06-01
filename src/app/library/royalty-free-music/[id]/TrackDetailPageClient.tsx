"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Download, Heart, Plus, Share2, ChevronLeft, Lock,
  Clock, Gauge, Key, Zap, Disc3, CheckCircle, ArrowRight,
  Layers, Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/usePlayerStore";
import { type LibraryTrack } from "@/lib/library-r2";

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const WaveformVisualizer = ({ isPlaying, progress = 0.65 }: { isPlaying: boolean; progress?: number }) => {
  const bars = useMemo(() =>
    Array.from({ length: 120 }).map((_, i) => {
      const base = Math.abs(Math.sin(i * 0.2) * 50 + Math.cos(i * 0.5) * 30 + Math.sin(i * 0.8) * 20);
      return Math.min(100, Math.max(15, base));
    }), []
  );

  return (
    <div className="relative h-20 w-full flex items-center gap-[2px] px-2">
      {bars.map((h, i) => {
        const pct = i / bars.length;
        const isPast = pct < progress;
        return (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              isPast
                ? "bg-primary shadow-[0_0_6px_rgba(124,255,0,0.6)]"
                : isPlaying
                ? "bg-white/20"
                : "bg-white/10"
            }`}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
};

const StatBadge = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | undefined }) => (
  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl">
    <Icon size={14} className="text-white/40" />
    <div className="flex flex-col">
      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider leading-none">{label}</span>
      <span className="text-[12px] font-bold text-white leading-none mt-1">{value}</span>
    </div>
  </div>
);

const TagPill = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" | "outline" }) => (
  <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-semibold ${
    variant === "primary"
      ? "bg-primary/10 text-primary border border-primary/20"
      : variant === "outline"
      ? "bg-white/[0.04] text-white/60 border border-white/[0.06]"
      : "bg-white/[0.04] text-white/60"
  }`}>
    {children}
  </span>
);

const DownloadOption = ({
  format,
  quality,
  size,
  locked,
  onDownload,
  onUnlock
}: {
  format: string;
  quality: string;
  size: string;
  locked: boolean;
  plan?: string;
  onDownload?: () => void;
  onUnlock?: () => void;
}) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
    locked
      ? "bg-white/[0.02] border-white/[0.05]"
      : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]"
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${locked ? "bg-white/[0.04]" : "bg-primary/10"}`}>
        {locked ? (
          <Lock size={18} className="text-white/30" />
        ) : (
          <Download size={18} className="text-primary" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[15px] font-bold text-white">{format}</p>
          {!locked && <CheckCircle size={14} className="text-primary" />}
        </div>
        <p className="text-[11px] text-white/40 font-medium">{quality} • {size}</p>
      </div>
    </div>
    {locked ? (
      <button
        onClick={onUnlock}
        className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all border border-white/[0.08]"
      >
        Unlock
      </button>
    ) : (
      <button
        onClick={onDownload}
        className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-black text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all"
      >
        Download
      </button>
    )}
  </div>
);

const SimilarTrackRow = ({ track, isActive, isPlaying, onPlay }: {
  track: any;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
    isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
  }`}>
    <button onClick={onPlay} className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative">
      <img src={track.image} alt="" className="w-full h-full object-cover" />
      <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${isActive && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        {isActive && isPlaying ? (
          <Pause size={14} className="text-white fill-white" />
        ) : (
          <Play size={14} className="text-white fill-white translate-x-0.5" />
        )}
      </div>
    </button>
    <div className="flex-1 min-w-0">
      <Link href={`/library/royalty-free-music/${track.id}`}>
        <p className={`text-[13px] font-bold truncate mb-0.5 transition-colors ${isActive ? "text-primary" : "text-white group-hover:text-primary"}`}>
          {track.title}
        </p>
      </Link>
      <p className="text-[11px] text-white/40 font-medium truncate">{track.artist}</p>
    </div>
    <span className="text-[11px] font-semibold text-white/30 tabular-nums w-10 text-right">{track.duration}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface TrackDetailPageClientProps {
  track: LibraryTrack;
  similarTracks: LibraryTrack[];
}

export default function TrackDetailPageClient({ track, similarTracks }: TrackDetailPageClientProps) {
  const router = useRouter();
  const { playTrack, activeTrack, isPlaying, likedTrackIds, toggleLike, fetchFavorites } = usePlayerStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isActive = activeTrack?.id === track.id;
  const isLiked = likedTrackIds.includes(track.id);

  const handlePlay = useCallback(() => {
    playTrack(track);
  }, [track, playTrack]);

  const handleLike = useCallback(() => {
    toggleLike(track.id).catch(() => {});
  }, [track.id, toggleLike]);

  const handleDownload = useCallback(() => {
    alert(`Downloading ${track.title}...\n\nThis would trigger the signed URL generation.`);
  }, [track]);

  return (
    <div className="min-h-screen bg-[#060606] text-white font-body">
      {/* ── HEADER BAR ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10 h-16 border-b border-white/[0.04] bg-[#060606]/90 backdrop-blur-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
            <Share2 size={15} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-5xl mx-auto px-6 lg:px-10 pb-24">
        {/* ── HERO ── */}
        <section className="pt-12 pb-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Cover Art */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full lg:w-72 shrink-0"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06] bg-[#111]">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Play overlay */}
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(124,255,0,0.4)]">
                  {isActive && isPlaying ? (
                    <Pause fill="black" size={24} />
                  ) : (
                    <Play fill="black" size={24} className="translate-x-0.5" />
                  )}
                </div>
              </button>
            </motion.div>

            {/* Track Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0 pt-2"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {track.genre.slice(0, 2).map(g => (
                  <TagPill key={g}>{g}</TagPill>
                ))}
              </div>

              <h1 className="text-4xl lg:text-6xl font-black tracking-tight uppercase leading-[1] mb-4">
                {track.title}
              </h1>

              <p className="text-lg text-white/60 font-medium mb-8">{track.artist}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-3 mb-10">
                <StatBadge icon={Gauge} label="BPM" value={String(track.bpm)} />
                <StatBadge icon={Key} label="Key" value={track.keySig || "—"} />
                <StatBadge icon={Clock} label="Duration" value={track.duration || "—"} />
                <StatBadge icon={Zap} label="Energy" value={track.energy || "—"} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(124,255,0,0.15)]"
                >
                  {isActive && isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="translate-x-0.5" />}
                  {isActive && isPlaying ? "Pause" : "Play Full Track"}
                </button>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all border ${
                    isLiked
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white"
                  }`}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  {isLiked ? "Liked" : "Like"}
                </button>
                <button className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white transition-all">
                  <Plus size={16} />
                  Add to Playlist
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WAVEFORM PLAYER ── */}
        <section className="mb-10">
          <div className="bg-[#0d0d10] border border-white/[0.06] rounded-2xl p-6">
            <WaveformVisualizer isPlaying={isActive && isPlaying} />
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-[11px] font-semibold text-white/40">0:00</span>
              <span className="text-[11px] font-semibold text-white/40">{track.duration}</span>
            </div>
          </div>
        </section>

        {/* ── DETAILS GRID ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          {/* LEFT: Classification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-[#0a0a0d] border border-white/[0.05] rounded-2xl p-6"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <Layers size={14} className="text-primary" />
              Track Classification
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {track.genre.map((g: string) => <TagPill key={g} variant="outline">{g}</TagPill>)}
                </div>
              </div>
              {track.moods && track.moods.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {track.moods.map((m: string) => <TagPill key={m}>{m}</TagPill>)}
                  </div>
                </div>
              )}
              {track.instruments && track.instruments.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Instruments</p>
                  <div className="flex flex-wrap gap-2">
                    {track.instruments.map((ins: string) => <TagPill key={ins} variant="outline">{ins}</TagPill>)}
                  </div>
                </div>
              )}
              {track.useCases && track.useCases.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Perfect For</p>
                  <div className="flex flex-wrap gap-2">
                    {track.useCases.map((uc: string) => <TagPill key={uc} variant="primary">{uc}</TagPill>)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: License */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] rounded-2xl p-6"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              License & Usage
            </h3>
            <div className="space-y-3 mb-6">
              {[
                "YouTube & social media monetization",
                "Podcasts & vlogs",
                "Client & commercial projects",
                "Digital ads & streaming",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[12px] text-white/60 font-medium">
                  <CheckCircle size={14} className="text-primary/70 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white transition-all"
            >
              View Full License
              <ArrowRight size={12} />
            </Link>
          </motion.div>
        </section>

        {/* ── DOWNLOADS ── */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">
            Download Options
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DownloadOption
              format="WAV"
              quality="Lossless • 24-bit / 48kHz"
              size="~35 MB"
              locked={true}
              plan="Pro"
              onUnlock={() => setShowUnlockModal(true)}
              onDownload={handleDownload}
            />
            <DownloadOption
              format="MP3"
              quality="320 kbps"
              size="~10 MB"
              locked={false}
              onDownload={handleDownload}
            />
          </div>
        </section>

        {/* ── SIMILAR TRACKS ── */}
        {similarTracks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Similar Tracks
              </h3>
              <Link href="/library/royalty-free-music" className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-1">
              {similarTracks.map((t) => (
                <SimilarTrackRow
                  key={t.id}
                  track={t}
                  isActive={activeTrack?.id === t.id}
                  isPlaying={isPlaying}
                  onPlay={() => playTrack(t)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── UNLOCK MODAL ── */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUnlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-8 max-w-md w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Lock size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-black mb-2">Unlock Full Downloads</h3>
              <p className="text-white/50 text-sm font-medium mb-6 leading-relaxed">
                WAV files require a Pro or Enterprise subscription. Start your free trial to get unlimited access to all tracks.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/pricing"
                  className="w-full py-4 bg-primary text-black rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all"
                >
                  View Plans
                </Link>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full py-3 text-white/50 hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
