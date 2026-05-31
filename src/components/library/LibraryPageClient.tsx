"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  AudioLines,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Compass,
  Download,
  SlidersHorizontal,
  Grid2X2,
  Heart,
  Library,
  ListMusic,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Volume2,
  X,
  User,
  LogOut,
  Settings,
  ChevronUp,
  SkipBack,
  SkipForward,
  Tag,
  Music,
  VolumeX,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Clapperboard,
  Gamepad2,
  Mic2,
  Briefcase,
  Film,
  Home,
  Smile,
  Folder,
  FileText,
  Crown,
  Bell,
  ArrowRight,
  Share2,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePlayerStore } from "@/store/usePlayerStore";
import type { LibraryKind, LibraryTrack } from "@/lib/library-r2";

// Deterministic waveform generator
function createWaveform(track: LibraryTrack): number[] {
  if (track.waveform && track.waveform.length > 0) {
    return track.waveform;
  }
  const count = 35;
  const bars: number[] = [];
  const seedString = track.id + track.title;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < count; i++) {
    const val = Math.abs(Math.sin(hash + i * 0.85) * 0.7) + 0.15;
    bars.push(Math.max(0.1, Math.min(1, val)));
  }
  return bars;
}

// TrackWaveformPro component
function TrackWaveformPro({ track, active, playing }: { track: LibraryTrack; active: boolean; playing: boolean }) {
  const bars = useMemo(() => createWaveform(track), [track]);
  const playedBars = playing ? 28 : active ? 18 : 0;
  const waveformRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waveformRef.current || !glowRef.current) return;

    if (active) {
      waveformRef.current.style.setProperty('--waveform-count', bars.length.toString());
      waveformRef.current.style.setProperty('--waveform-active', playedBars.toString());

      gsap.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in"
      });
    }
  }, [active, playing, bars.length, playedBars]);

  const isSFX = track.kind === "sfx";
  const waveformColor = active
    ? (isSFX ? "#4f56fd" : "var(--waveform-active)")
    : "var(--waveform-bg)";
  const glowColor = isSFX ? "#4f56fd" : "#68d884";
  const hoverColor = isSFX ? "bg-sfx/10" : "bg-primary/10";

  return (
    <div className={`group relative h-8 w-full max-w-[200px] overflow-hidden flex items-center gap-[2px]`} aria-hidden="true">
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 scale-95 transition-all duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${glowColor}33 35%, ${glowColor}33 60%, transparent 100%)`,
          filter: `blur(12px)`,
        }}
      />

      <div ref={waveformRef} className="flex items-center gap-[2px] h-full w-full z-10">
        {bars.map((height, index) => {
          const isPlayed = active && index < playedBars;
          return (
            <span
              key={`${track.id}-${index}`}
              className={`w-[2px] rounded-full transition-all waveform-bg hover:${hoverColor}`}
              style={
                isPlayed ? {
                  height: `${Math.round(height * 24) + 4}px`,
                  backgroundColor: waveformColor,
                  transitionDuration: "150ms",
                  transform: 'scaleY(1.05)',
                  boxShadow: `0 0 6px ${glowColor}44`,
                } : {
                  height: `${Math.round(height * 24) + 4}px`,
                  transitionDuration: active ? "200ms" : "300ms",
                  opacity: active ? 0.8 : 0.4,
                  backgroundColor: "rgba(255,255,255,0.3)"
                }
              }
            />
          );
        })}
      </div>
    </div>
  );
}

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Browse", active: true },
  { icon: Grid2X2, label: "Genres" },
  { icon: Smile, label: "Moods" },
  { icon: Folder, label: "Collections" },
  { icon: TrendingUp, label: "Trending" },
  { icon: Sparkles, label: "New Releases" },
];

const LIBRARY_ITEMS = [
  { icon: Heart, label: "Favorites", href: "/library/liked" },
  { icon: Download, label: "Downloads", href: "/library/downloads" },
  { icon: FileText, label: "Licenses", href: "/library/downloads" },
  { icon: ShieldCheck, label: "Clearance / Whitelist", href: "/library/whitelist" },
];

const POPULAR_SEARCHES = [
  "Cinematic Trailer", "Tech Review", "Upbeat Vlog", "Luxury", "Motivational"
];

interface LibraryPageClientProps {
  kind: LibraryKind;
  tracks: LibraryTrack[];
}

export default function LibraryPageClient({ kind, tracks }: LibraryPageClientProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [heroSearchQuery, setHeroSearchQuery] = useState("");

  // Filter states
  const [selectedMood, setSelectedMood] = useState<string>("All");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("Any");

  const [likedTracks, setLikedTracks] = useState<Record<string, boolean>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { activeTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const { availableGenres, availableMoods } = useMemo(() => {
    const genresSet = new Set<string>();
    const moodsSet = new Set<string>();

    tracks.forEach(t => {
      if (t.genre) t.genre.forEach(g => { if (g && g !== "-") genresSet.add(g); });
      if (t.moods) t.moods.forEach(m => { if (m && m !== "-") moodsSet.add(m); });
    });

    return {
      availableGenres: ["All", ...Array.from(genresSet).slice(0, 10)],
      availableMoods: ["All", ...Array.from(moodsSet).slice(0, 10)],
    };
  }, [tracks]);

  const handlePlayToggle = (track: LibraryTrack) => {
    if (activeTrack && activeTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        bpm: track.bpm,
        keySig: track.keySig,
        duration: track.duration,
        image: track.image,
        audioUrl: track.audioUrl
      });
    }
  };

  const handleLike = (id: string) => {
    setLikedTracks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (track: LibraryTrack) => {
    if (downloadingId) return;
    setDownloadingId(track.id);
    setTimeout(() => {
      setDownloadingId(null);
      if (track.audioUrl) {
        const link = document.createElement("a");
        link.href = track.audioUrl;
        link.setAttribute("download", `${track.title} - ${track.artist}.mp3`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 1200);
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const query = (heroSearchQuery || searchQuery).toLowerCase();
      const matchesSearch = !query ||
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        t.genre.some(g => g.toLowerCase().includes(query)) ||
        (t.moods && t.moods.some(m => m.toLowerCase().includes(query)));

      const matchesGenre = selectedGenre === "All" || t.genre.includes(selectedGenre);
      const matchesMood = selectedMood === "All" || (t.moods && t.moods.includes(selectedMood));

      return matchesSearch && matchesGenre && matchesMood;
    });
  }, [tracks, searchQuery, heroSearchQuery, selectedGenre, selectedMood]);

  return (
    // Note: We use absolute positioning to cover the global navbar to simulate a true dashboard layout,
    // or we can just rely on the existing layout. Using a fixed viewport approach is best for dashboards.
    <div className="fixed inset-0 z-50 flex bg-[#0c0d12] text-white font-body overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-[260px] flex-shrink-0 border-r border-white/5 bg-[#080808] flex flex-col h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <AudioLines className="text-primary h-7 w-7" />
          <span className="font-display font-bold text-xl tracking-tight">Soundly<span className="text-primary">.</span></span>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-1 pb-6">
            {SIDEBAR_ITEMS.map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className={`w-full justify-start gap-3 rounded-xl px-4 py-6 text-sm font-medium transition-colors ${item.active
                  ? "bg-white/5 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                  }`}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "text-white" : ""}`} />
                {item.label}
              </Button>
            ))}

            <div className="my-4 border-t border-white/5" />

            {LIBRARY_ITEMS.map((item, i) => (
              <Link key={i} href={item.href || "#"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* Go Premium Box */}
        <div className="p-4 mt-auto">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
            <div className="flex flex-col gap-3">
              <Crown className="text-primary h-6 w-6" />
              <div>
                <h4 className="font-bold text-white mb-1">Go Premium</h4>
                <p className="text-xs text-white/50 leading-relaxed">Unlock unlimited downloads and get full access.</p>
              </div>
              <Button className="w-full bg-primary text-black hover:bg-primary/90 rounded-full font-bold uppercase tracking-wider text-xs h-10 mt-2">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0a0b0f]">

        {/* TOPBAR */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search for moods, genres, titles..."
              className="w-full bg-white/[0.03] border-white/10 rounded-full pl-12 pr-4 h-11 text-sm text-white placeholder:text-white/30 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <Button className="bg-primary/20 text-primary hover:bg-primary/30 rounded-full h-10 px-6 font-semibold">
              Pricing
            </Button>
            <button className="text-white/60 hover:text-white transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-3 hover:bg-white/5 px-2 py-1.5 rounded-full transition-colors">
                  <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white/90">Alex Carter</span>
                  <ChevronDown className="h-4 w-4 text-white/40" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#111] border-white/10 text-white">
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Profile</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-red-400">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* SCROLLABLE MAIN */}
        <ScrollArea className="flex-1 pb-32">

          {/* HERO */}
          <div className="relative pt-16 pb-12 px-8 overflow-hidden">
            {/* Wavy Background Graphic Simulation */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute bottom-0 text-primary/20">
                <path d="M0,150 C150,300 350,0 500,150 C650,300 850,0 1000,150 L1000,300 L0,300 Z" fill="currentColor" opacity="0.3" />
                <path d="M0,200 C200,50 400,250 600,100 C800,-50 900,150 1000,100 L1000,300 L0,300 Z" fill="currentColor" opacity="0.1" />
              </svg>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[140px] rounded-full -mt-40 -mr-20" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                Find the perfect track
              </h1>
              <p className="text-base text-white/60 mb-8 font-medium">
                High quality, royalty-free music for every project.
              </p>

              <div className="relative w-full max-w-2xl mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search for cinematic, happy, vlog, corporate..."
                  className="w-full bg-[#080808]/80 border-white/10 rounded-full pl-14 pr-16 h-14 text-base text-white placeholder:text-white/40 focus-visible:ring-primary/30 backdrop-blur-md shadow-2xl"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-black transition-colors flex items-center justify-center p-0">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-white/50 font-semibold mr-2">Popular searches:</span>
                {POPULAR_SEARCHES.map(term => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="bg-white/5 hover:bg-white/10 border-white/10 text-white/70 font-medium py-1.5 px-3 cursor-pointer rounded-full transition-colors"
                    onClick={() => setHeroSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="px-8 mb-8 relative z-20">
            <div className="flex items-center flex-wrap gap-3 bg-[#0f1115] border border-white/5 rounded-2xl p-2.5">

              {/* Mood Filter */}
              <Select value={selectedMood} onValueChange={(val) => setSelectedMood(val || "All")}>
                <SelectTrigger className="w-[140px] bg-transparent border-none text-white focus:ring-0 shadow-none hover:bg-white/5 rounded-xl h-12">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><Smile className="h-3 w-3 text-primary" /> Mood</span>
                    <SelectValue placeholder="All" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {availableMoods.map(m => (
                    <SelectItem key={m} value={m} className="focus:bg-white/10 focus:text-white">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-[1px] h-8 bg-white/5 mx-1" />

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={(val) => setSelectedGenre(val || "All")}>
                <SelectTrigger className="w-[140px] bg-transparent border-none text-white focus:ring-0 shadow-none hover:bg-white/5 rounded-xl h-12">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><Grid2X2 className="h-3 w-3 text-primary" /> Genre</span>
                    <SelectValue placeholder="All" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {availableGenres.map(g => (
                    <SelectItem key={g} value={g} className="focus:bg-white/10 focus:text-white">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-[1px] h-8 bg-white/5 mx-1" />

              {/* Duration Filter */}
              <Select value={selectedDuration} onValueChange={(val) => setSelectedDuration(val || "Any")}>
                <SelectTrigger className="w-[130px] bg-transparent border-none text-white focus:ring-0 shadow-none hover:bg-white/5 rounded-xl h-12">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" /> Duration</span>
                    <SelectValue placeholder="Any" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="Any" className="focus:bg-white/10 focus:text-white">Any</SelectItem>
                  <SelectItem value="< 1:00" className="focus:bg-white/10 focus:text-white">&lt; 1:00</SelectItem>
                  <SelectItem value="1:00 - 3:00" className="focus:bg-white/10 focus:text-white">1:00 - 3:00</SelectItem>
                  <SelectItem value="> 3:00" className="focus:bg-white/10 focus:text-white">&gt; 3:00</SelectItem>
                </SelectContent>
              </Select>

              {/* More placeholders just like screenshot */}
              <div className="w-[1px] h-8 bg-white/5 mx-1" />
              <div className="flex flex-col items-start gap-0.5 px-3 py-1 cursor-pointer hover:bg-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><Mic2 className="h-3 w-3 text-primary" /> Vocals</span>
                <span className="text-sm font-medium">Any <ChevronDown className="inline h-3 w-3 ml-1 text-white/50" /></span>
              </div>

              <div className="w-[1px] h-8 bg-white/5 mx-1" />
              <div className="flex flex-col items-start gap-0.5 px-3 py-1 cursor-pointer hover:bg-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-primary" /> Energy</span>
                <span className="text-sm font-medium">Any <ChevronDown className="inline h-3 w-3 ml-1 text-white/50" /></span>
              </div>

              <div className="w-[1px] h-8 bg-white/5 mx-1" />
              <div className="flex flex-col items-start gap-0.5 px-3 py-1 cursor-pointer hover:bg-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5"><FileText className="h-3 w-3 text-primary" /> Usage</span>
                <span className="text-sm font-medium">All <ChevronDown className="inline h-3 w-3 ml-1 text-white/50" /></span>
              </div>

              <div className="ml-auto">
                <Button variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white h-10 px-4 rounded-xl font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>

          {/* TRACK LISTING */}
          <div className="px-8 pb-12">

            {/* Table Headers */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
              <span className="w-12 text-center shrink-0">Track</span>
              <span className="w-[240px] shrink-0 invisible">Title</span>
              <span className="flex-1 min-w-[200px]"></span>
              <span className="w-24 text-left shrink-0">Mood</span>
              <span className="w-28 text-left shrink-0">Genre</span>
              <span className="w-20 text-left shrink-0">Duration</span>
              <span className="w-16 text-left shrink-0">BPM</span>
              <span className="w-32 shrink-0"></span>
            </div>

            {/* List */}
            <div className="flex flex-col">
              {filteredTracks.map((track, i) => {
                const isActive = activeTrack?.id === track.id;
                const isPlayingTrack = isActive && isPlaying;
                const isLiked = !!likedTracks[track.id];
                const isDownloading = downloadingId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors border-b border-white/[0.02] last:border-0 ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                      }`}
                  >
                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayToggle(track)}
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${isActive
                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        : "bg-white/5 text-white hover:bg-white/20"
                        }`}
                    >
                      {isPlayingTrack ? (
                        <Pause className="h-4 w-4" fill="currentColor" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
                      )}
                    </button>

                    {/* Cover Image */}
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 relative">
                      {track.image ? (
                        <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/30">
                          {kind === "music" ? "TRK" : "SFX"}
                        </div>
                      )}
                    </div>

                    {/* Title & Artist */}
                    <div className="w-[240px] shrink-0 flex flex-col justify-center pr-4">
                      <span className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-white/90 group-hover:text-white"}`}>
                        {track.title}
                      </span>
                      <span className="text-xs text-white/50 font-medium truncate mt-0.5">
                        {track.artist}
                      </span>
                    </div>

                    {/* Waveform */}
                    <div className="flex-1 min-w-[200px] flex items-center gap-3">
                      <span className="text-xs text-white/30 font-medium w-8 text-right tabular-nums">0:45</span>
                      <div className="flex-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <TrackWaveformPro track={track} active={isActive} playing={isPlayingTrack} />
                      </div>
                    </div>

                    {/* Mood */}
                    <div className="w-24 shrink-0">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold px-2.5 py-0.5 text-[11px] capitalize rounded-md">
                        {track.moods?.[0] || "Epic"}
                      </Badge>
                    </div>

                    {/* Genre */}
                    <div className="w-28 shrink-0">
                      <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10 font-medium px-2.5 py-0.5 text-[11px] capitalize rounded-md">
                        {track.genre?.[0] || "Cinematic"}
                      </Badge>
                    </div>

                    {/* Duration */}
                    <div className="w-20 shrink-0 text-sm text-white/70 font-medium tabular-nums">
                      {track.duration}
                    </div>

                    {/* BPM */}
                    <div className="w-16 shrink-0 text-sm text-white/70 font-medium tabular-nums">
                      {track.bpm || "92"}
                    </div>

                    {/* Actions */}
                    <div className="w-32 shrink-0 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleLike(track.id)} className="text-white/40 hover:text-white transition-colors p-1">
                        <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDownload(track)} className="text-white/40 hover:text-white transition-colors p-1">
                        {isDownloading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" strokeWidth={1.5} />
                        )}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Placeholder */}
            {filteredTracks.length > 0 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-sm">
                <span className="text-white/50 mb-4 sm:mb-0">
                  1-20 of 684 tracks
                </span>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white rounded-md">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-primary border-primary text-black hover:bg-primary/90 font-bold rounded-md">
                    1
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-transparent text-white hover:bg-white/10 font-medium rounded-md">
                    2
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-transparent text-white hover:bg-white/10 font-medium rounded-md">
                    3
                  </Button>
                  <span className="text-white/30 px-2">...</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-transparent text-white hover:bg-white/10 font-medium rounded-md">
                    35
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white rounded-md">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            )}

            {filteredTracks.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-3xl p-8 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                  <Search className="h-5 w-5 text-white/40" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No tracks found</h3>
                <p className="text-sm font-medium text-white/40 leading-relaxed max-w-sm">
                  We couldn't find any {kind === "music" ? "tracks" : "sounds"} matching your search query or filter selections.
                </p>
                <Button
                  onClick={() => { setHeroSearchQuery(""); setSearchQuery(""); setSelectedMood("All"); setSelectedGenre("All"); }}
                  className="mt-6 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs h-10 px-8 hover:bg-white/90"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}