"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Heart, Plus, ShoppingCart, Download, ShieldCheck, Sparkles, ChevronDown
} from "lucide-react";
import { usePlayerStore, type Track } from "@/store/usePlayerStore";
import { useCartStore } from "@/store/useCartStore";
import { type LibraryTrack } from "@/lib/library-r2";
import { getTrackWaveform, WAVEFORM_BAR_COUNT } from "@/lib/waveform";

interface TrackRowProps {
  track: LibraryTrack;
  activeTrack: Track | null;
  isPlaying: boolean;
  isLiked: boolean;
  onPlayToggle: (track: LibraryTrack) => void;
  onHeartClick: (id: string) => void;
  onDownload: (track: LibraryTrack) => void;
  allTracks: LibraryTrack[];
  theme?: "dark" | "light";
}

export function TrackRow({
  track,
  activeTrack,
  isPlaying,
  isLiked,
  onPlayToggle,
  onHeartClick,
  onDownload,
  allTracks,
  theme = "dark"
}: TrackRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Full Version");
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Zustand subscriptions for high-performance progress ticks (only the active row re-renders!)
  const isActive = activeTrack?.id === track.id;
  const storeProgress = usePlayerStore((state) => isActive ? state.progress : 0);
  const storeDuration = usePlayerStore((state) => isActive ? state.duration : 0);
  const playTrack = usePlayerStore((state) => state.playTrack);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [isHoveringWaveform, setIsHoveringWaveform] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  const parsedDuration = useMemo(() => {
    const parts = track.duration.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 200;
  }, [track.duration]);

  const activeDuration = isActive && storeDuration > 0 ? storeDuration : parsedDuration;
  const activeProgress = isActive ? storeProgress : 0;

  const waves = useMemo(() => getTrackWaveform(track), [track]);

  const seekFromClientX = useCallback((clientX: number) => {
    if (!waveformRef.current || activeDuration <= 0) return;
    const bounds = waveformRef.current.getBoundingClientRect();
    const x = clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    const seekTime = percentage * activeDuration;

    if (isActive) {
      usePlayerStore.getState().setSeekTo(seekTime);
    } else {
      onPlayToggle(track);
      // Small timeout to allow player to initialize
      setTimeout(() => {
        usePlayerStore.getState().setSeekTo(seekTime);
      }, 50);
    }
  }, [activeDuration, isActive, onPlayToggle, track]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    setIsScrubbing(true);
    seekFromClientX(e.clientX);
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMouseMove = (event: MouseEvent) => {
      seekFromClientX(event.clientX);
      if (!waveformRef.current || activeDuration <= 0) return;
      const bounds = waveformRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      setHoverPercent(percentage);
      setHoverIndex(Math.floor(percentage * WAVEFORM_BAR_COUNT));
    };

    const handleMouseUp = () => setIsScrubbing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeDuration, isScrubbing, seekFromClientX]);



  const handleMouseMoveWaveform = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || activeDuration <= 0) return;
    const bounds = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    setHoverPercent(percentage);
    setHoverIndex(Math.floor(percentage * WAVEFORM_BAR_COUNT));
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Simulated packaging progress loop
  const handleFormatDownload = (format: string) => {
    setDownloadingFormat(format);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFormat(null);
            setDownloadProgress(0);
            onDownload(track);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getTrackUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/library/royalty-free-music/${track.id}`;
  };



  const similarTracks = useMemo(() => {
    return allTracks
      .filter((t) => t.id !== track.id)
      .slice(0, 3);
  }, [allTracks, track.id]);

  const moodTag = track.moods?.[0] || "Cinematic";
  const genreTag = track.genre?.[0] || (track.kind === "sfx" ? "Sound Effect" : "Ambient");
  const energyTag = Number(track.bpm) > 130 ? "High" : Number(track.bpm) > 100 ? "Medium" : "Chill";

  // Check if track is "new" for visual badge (Wonderment has it in the mockup)
  const isNewTrack = track.title.toLowerCase().includes("wonderment") || track.title.toLowerCase().includes("changing") || track.id === "music-velvet" || track.id === "music-ethereal-drift";

  return (
    <div 
      className={`relative overflow-visible border-b transition-colors duration-200 z-0 ${
        theme === "light" 
          ? "border-black/[0.06] " + (isActive ? "bg-black/[0.045]" : "bg-transparent hover:bg-black/[0.035]")
          : "border-white/[0.045] " + (isActive ? "bg-white/[0.055]" : "bg-transparent hover:bg-white/[0.035]")
      }`}
    >
      {/* Primary Row Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group/row relative grid min-h-[66px] cursor-pointer select-none grid-cols-[minmax(220px,320px)_minmax(340px,1fr)_56px_minmax(0,220px)_auto] items-center gap-4 px-2.5 py-2 text-left lg:px-3 max-lg:grid-cols-[minmax(220px,1fr)_auto] max-md:flex max-md:flex-wrap max-md:gap-3"
      >
        {/* Track Information */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle(track);
            }}
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[4px] bg-white/[0.04] text-white shadow-[0_8px_18px_rgba(0,0,0,0.24)] transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            title={isActive && isPlaying ? "Pause track" : "Play track"}
          >
            {track.image ? (
              <img src={track.image} alt={track.title} className="h-full w-full object-cover transition-transform duration-500 group-hover/row:scale-105" />
            ) : (
              <span className={`flex h-full w-full items-center justify-center text-[10px] font-bold ${
                theme === "light" ? "bg-black/[0.06] text-black/40" : "bg-white/[0.04] text-white/30"
              }`}>
                {track.kind === "sfx" ? "SFX" : "TRK"}
              </span>
            )}
            <span className={`absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity ${
              isActive || isPlaying ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
            }`}>
              {isActive && isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
              )}
            </span>
          </button>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <span className={`truncate text-[15px] font-medium leading-tight tracking-normal transition-colors ${
                isActive 
                  ? "text-[#7CFF00]" 
                  : theme === "light" ? "text-neutral-900" : "text-white"
              }`}>
                {track.title}
              </span>
              {isNewTrack && (
                <span className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] font-medium leading-none ${
                  theme === "light"
                    ? "border-black/15 bg-black/10 text-neutral-700"
                    : "border-white/15 bg-white/10 text-white/70"
                }`}>
                  New
                </span>
              )}
            </div>
            <span className={`mt-1 block truncate text-[12.5px] font-medium leading-tight tracking-normal ${
              theme === "light" ? "text-neutral-500" : "text-white/58"
            }`}>{track.artist}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer md:flex ${
              theme === "light"
                ? "text-neutral-600 hover:bg-black/[0.06] hover:text-neutral-900"
                : "text-white/65 hover:bg-white/[0.06] hover:text-white"
            }`}
            title={isExpanded ? "Hide track details" : "Show track details"}
          >
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Waveform Hero */}
        <div className="hidden min-w-[340px] items-center lg:col-start-2 lg:flex w-full" onClick={(e) => e.stopPropagation()}>
          <div
            ref={waveformRef}
            onMouseDown={handleSeek}
            onMouseMove={handleMouseMoveWaveform}
            onMouseEnter={() => setIsHoveringWaveform(true)}
            onMouseLeave={() => {
              setIsHoveringWaveform(false);
              setHoverIndex(null);
              setHoverPercent(null);
            }}
            className="relative flex h-12 w-full cursor-pointer select-none items-center"
          >
            <div className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${theme === "light" ? "bg-black/[0.08]" : "bg-white/[0.08]"}`} />
            <div className="relative z-10 flex h-full w-full items-center gap-[1px]">
              {waves.map((heightPercent, i) => {
                const barPercent = (i / WAVEFORM_BAR_COUNT) * 100;
                const progressPercent = activeDuration > 0 ? (activeProgress / activeDuration) * 100 : 0;
                const isPlayed = barPercent <= progressPercent;

                const distance = hoverIndex !== null ? Math.abs(i - hoverIndex) : 999;
                const scale = distance <= 6 ? 1 + (0.16 * Math.cos((distance / 6) * (Math.PI / 2))) : 1;

                return (
                  <span
                    key={i}
                    className="min-w-[1px] flex-1 rounded-[1px] transition-all duration-75"
                    style={{
                      height: `${heightPercent * scale}%`,
                      backgroundColor: isPlayed
                        ? (theme === "light" ? "rgba(0,0,0,0.72)" : "rgba(245,245,245,0.9)")
                        : (isHoveringWaveform || isScrubbing) && distance <= 5
                        ? (theme === "light" ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.28)")
                        : (theme === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.13)")
                    }}
                  />
                );
              })}
            </div>

            {/* Hover seek preview line */}
            {(isHoveringWaveform || isScrubbing) && hoverPercent !== null && activeDuration > 0 && (
              <div 
                className="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center" 
                style={{ left: `${hoverPercent * 100}%` }}
              >
                <div className={`h-full w-[1.5px] ${theme === "light" ? "bg-black/45" : "bg-white/45"}`} />
                {/* Floating Elapsed Time Badge */}
                <div className={`absolute bottom-full mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-lg shrink-0 pointer-events-none transition-all ${
                  theme === "light" 
                    ? "bg-neutral-900 text-white border border-black/10" 
                    : "bg-[#121316] text-white border border-white/10"
                }`}>
                  {formatTime(hoverPercent * activeDuration)}
                </div>
              </div>
            )}
          </div>
        </div>

        <span
          className={`hidden w-14 justify-self-end text-right text-[13px] font-medium tabular-nums lg:col-start-3 lg:block ${
            theme === "light" ? "text-neutral-800" : "text-white/78"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {track.duration}
        </span>

        <div
          className={`hidden min-w-0 truncate text-[12.5px] font-medium capitalize tracking-normal lg:col-start-4 2xl:block ${
            theme === "light" ? "text-neutral-500" : "text-white/52"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {track.moods?.slice(0, 4).join(", ") || [moodTag, genreTag].filter(Boolean).join(", ")}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="flex shrink-0 items-center justify-end gap-4 lg:col-start-5 max-lg:col-start-2 max-md:w-full max-md:justify-between" onClick={(e) => e.stopPropagation()}>
          <span className={`hidden text-[13px] font-medium tabular-nums sm:block lg:hidden ${
            theme === "light" ? "text-neutral-800" : "text-white/78"
          }`}>{track.duration}</span>

          {/* Actions Button Stack */}
          <div className={`flex items-center gap-2.5 ${theme === "light" ? "text-neutral-700" : "text-white"}`}>


            {/* Add To Playlist */}
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                theme === "light"
                  ? "text-neutral-600 hover:bg-black/[0.06] hover:text-neutral-900"
                  : "text-white/75 hover:bg-white/[0.06] hover:text-white"
              }`}
              title="Add to Playlist"
            >
              <Plus size={20} strokeWidth={1.9} />
            </button>

            {/* Favorite */}
            <button
              onClick={() => onHeartClick(track.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                isLiked 
                  ? (theme === "light" ? "text-[#00E58C]" : "text-white") 
                  : (theme === "light" ? "text-neutral-600 hover:bg-black/[0.06] hover:text-neutral-900" : "text-white/85 hover:bg-white/[0.06] hover:text-white")
              }`}
              title="Favorite"
            >
              <Heart size={21} strokeWidth={1.9} fill={isLiked ? "currentColor" : "none"} />
            </button>

            {/* License Track Primary business CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const { addItem } = useCartStore.getState();
                addItem({
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  genre: track.genre || [],
                  bpm: track.bpm,
                  keySig: track.keySig || "-",
                  duration: track.duration,
                  image: track.image || ""
                }, "Personal");
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                theme === "light"
                  ? "text-neutral-600 hover:bg-black/[0.06] hover:text-neutral-900"
                  : "text-white/78 hover:bg-white/[0.06] hover:text-white"
              }`}
              title="License track"
            >
              <ShoppingCart size={21} strokeWidth={1.9} />
            </button>

            {/* Download */}
            <button
              onClick={() => setIsExpanded(true)}
              className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#f2eded] text-black transition-colors hover:bg-white cursor-pointer"
              title="Download formats"
            >
              <Download size={21} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Sub-Panel Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`overflow-hidden border-t ${
              theme === "light" ? "bg-neutral-50 border-black/[0.06]" : "bg-[#121316] border-white/[0.06]"
            }`}
          >
            <div className="p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* Column 1: Detailed Metadata Specs (4/12) */}
              <div className={`lg:col-span-4 space-y-5 lg:pr-6 lg:border-r max-lg:pb-6 max-lg:border-b ${
                theme === "light" ? "border-black/[0.05]" : "border-white/[0.05]"
              }`}>
                <div>
                  <h4 className="text-xs font-medium text-neutral-500 mb-2">Track description</h4>
                  <p className={`text-xs font-normal leading-relaxed ${
                    theme === "light" ? "text-neutral-600" : "text-neutral-400"
                  }`}>
                    A cinematic and spacious background piece featuring premium {track.instruments?.join(", ") || "Acoustic Elements"}. Masterfully mixed to sit under vocals or sound designs perfectly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className={`p-3 border rounded-lg ${
                    theme === "light" ? "bg-black/[0.01] border-black/[0.04]" : "bg-white/[0.01] border-white/[0.04]"
                  }`}>
                    <span className="text-[11px] font-medium text-neutral-500">Tempo</span>
                    <p className={`text-xs font-medium mt-1 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                      {track.bpm !== "-" ? `${track.bpm} BPM` : "SFX sync"}
                    </p>
                  </div>
                  <div className={`p-3 border rounded-lg ${
                    theme === "light" ? "bg-black/[0.01] border-black/[0.04]" : "bg-white/[0.01] border-white/[0.04]"
                  }`}>
                    <span className="text-[11px] font-medium text-neutral-500">Key signature</span>
                    <p className={`text-xs font-medium mt-1 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                      {track.keySig && track.keySig !== "-" ? track.keySig : "Atmos"}
                    </p>
                  </div>
                  <div className={`p-3 border rounded-lg ${
                    theme === "light" ? "bg-black/[0.01] border-black/[0.04]" : "bg-white/[0.01] border-white/[0.04]"
                  }`}>
                    <span className="text-[11px] font-medium text-neutral-500">Mood</span>
                    <p className={`text-xs font-medium mt-1 capitalize ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                      {moodTag}
                    </p>
                  </div>
                  <div className={`p-3 border rounded-lg ${
                    theme === "light" ? "bg-black/[0.01] border-black/[0.04]" : "bg-white/[0.01] border-white/[0.04]"
                  }`}>
                    <span className="text-[11px] font-medium text-neutral-500">Energy intensity</span>
                    <p className="text-xs font-medium text-[#00E58C] mt-1">{energyTag}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-medium text-neutral-500">Permitted usage rights</span>
                  <div className="p-3 bg-[#00E58C]/5 border border-[#00E58C]/15 rounded-lg space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#00E58C]">
                      <ShieldCheck size={13} /> 100% Whitelisted Clearance
                    </div>
                    <p className={`text-[10px] leading-normal font-semibold ${
                      theme === "light" ? "text-neutral-600" : "text-neutral-400"
                    }`}>
                      Podcasts, YouTube Monetization, Social Ads, and Commercial client videos worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: Versions & Download formats (4/12) */}
              <div className={`lg:col-span-4 space-y-5 lg:px-6 lg:border-r max-lg:py-6 max-lg:border-b ${
                theme === "light" ? "border-black/[0.05]" : "border-white/[0.05]"
              }`}>
                {/* Alternate Edit Versions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-neutral-500">Alternate edit versions</h4>
                  <div className="flex flex-col gap-2">
                    {["Full Version", "60 Second", "30 Second", "15 Second", "Instrumental"].map((v) => {
                      const isSel = selectedVersion === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setSelectedVersion(v)}
                          className={`h-9 px-3.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer flex items-center justify-between border ${
                            isSel 
                              ? (theme === "light" ? "bg-neutral-950 text-white border-neutral-950" : "bg-white text-black border-white") 
                              : (theme === "light" ? "bg-transparent text-neutral-600 border-black/5 hover:border-black/15 hover:text-neutral-900" : "bg-transparent text-white/60 border-white/5 hover:border-white/15 hover:text-white")
                          }`}
                        >
                          <span>{v}</span>
                          <span className="text-[9px] opacity-60">
                            {v === "Full Version" ? track.duration : v === "60 Second" ? "1:00" : v === "30 Second" ? "0:30" : v === "15 Second" ? "0:15" : "Inst"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Download formats packaging card options */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-medium text-neutral-500">Download formats</h4>
                  
                  {downloadingFormat ? (
                    <div className={`p-4 rounded-xl text-center space-y-3 border ${
                      theme === "light" ? "bg-black/[0.02] border-black/5" : "bg-white/[0.02] border-white/5"
                    }`}>
                      <div className="h-7 w-7 border-3 border-[#00E58C]/25 border-t-[#00E58C] rounded-full animate-spin mx-auto" />
                      <div className="space-y-1">
                        <p className={`text-[11px] font-medium ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                          Packaging {downloadingFormat}...
                        </p>
                        <p className={`text-[9px] font-semibold ${
                          theme === "light" ? "text-neutral-600" : "text-neutral-400"
                        }`}>{downloadProgress}% Complete</p>
                      </div>
                      <div className={`w-full h-1 rounded-full overflow-hidden ${theme === "light" ? "bg-black/5" : "bg-white/5"}`}>
                        <div className="h-full bg-[#00E58C] transition-all duration-100" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5">
                      {["MP3", "WAV", "STEMS"].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleFormatDownload(fmt)}
                          className={`h-11 rounded-lg border transition-all text-xs font-medium flex items-center justify-center cursor-pointer ${
                            theme === "light" 
                              ? "border-black/5 hover:border-[#00E58C]/30 hover:bg-[#00E58C]/5 text-neutral-800" 
                              : "border-white/5 hover:border-[#00E58C]/30 hover:bg-[#00E58C]/5 text-white/80"
                          } ${
                            fmt === "WAV" ? "text-[#00E58C] border-[#00E58C]/15 bg-[#00E58C]/5" : ""
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Recommendations & Primary licensing Buy (4/12) */}
              <div className="lg:col-span-4 space-y-6 lg:pl-6 max-lg:pt-6 flex flex-col justify-between">
                
                {/* Similar Tracks discover panel */}
                <div className="space-y-3.5 flex-1">
                  <h4 className="text-xs font-medium text-[#00E58C] flex items-center gap-1.5">
                    <Sparkles size={12} /> Similar tracks
                  </h4>
                  <div className="space-y-2.5">
                    {similarTracks.map((sim) => (
                      <div 
                        key={sim.id}
                        onClick={() => {
                          playTrack({
                            id: sim.id, title: sim.title, artist: sim.artist,
                            genre: sim.genre, bpm: sim.bpm, keySig: sim.keySig,
                            duration: sim.duration, image: sim.image, audioUrl: sim.audioUrl,
                            waveform: sim.waveform
                          });
                        }}
                        className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-3 group/sim border ${
                          theme === "light"
                            ? "bg-black/[0.01] hover:bg-black/[0.03] border-black/5 hover:border-black/10"
                            : "bg-white/[0.01] hover:bg-white/[0.03] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <img src={sim.image} className="w-8 h-8 rounded object-cover shrink-0 border border-white/10" alt="" />
                        <div className="min-w-0 flex-1">
                          <h5 className={`font-medium text-xs truncate leading-tight group-hover/sim:text-[#00E58C] transition-colors ${
                            theme === "light" ? "text-neutral-900" : "text-white"
                          }`}>
                            {sim.title}
                          </h5>
                          <p className={`text-[10px] font-normal truncate mt-0.5 leading-none ${
                            theme === "light" ? "text-neutral-600" : "text-neutral-400"
                          }`}>{sim.artist}</p>
                        </div>
                        <Play size={11} fill="currentColor" className="text-neutral-500 group-hover/sim:text-white transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Licensing checkout CTA options */}
                <div className="space-y-2.5 pt-4">
                  <button className="w-full h-10 bg-[#00E58C] hover:bg-[#00E58C]/90 text-black text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00E58C]/10 border border-[#00E58C]/30">
                    <ShoppingCart size={13} strokeWidth={2.5} />
                    License Track - $29.00
                  </button>
                  <p className={`text-[9px] font-semibold text-center leading-relaxed ${
                    theme === "light" ? "text-neutral-600" : "text-neutral-500"
                  }`}>
                    Single production license covers forever usage in one advertising campaign or video project.
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
