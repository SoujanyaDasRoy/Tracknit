"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile, Grid2X2, Zap, Mic2, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, ChevronLeft, ChevronRight, Search, ShoppingCart, Play, Pause, X, Menu,
  Download, Plus, MoreVertical, ArrowRight, Check, Heart, ShieldCheck, Folder, FileText, LogIn,
  Scissors, Layers, MoreHorizontal, Sparkles, Crown
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePlayerStore } from "@/store/usePlayerStore";
import { getLibraryTracks, type LibraryTrack } from "@/lib/library-r2";
import { apiFetch } from "@/lib/api-client";
import { UserDropdown } from "@/components/library/UserDropdown";
import { TrackRow } from "@/components/library/TrackRow";

// ─────────────────────────────────────────────────────────────────
// SIDEBAR ACCORDION
// ─────────────────────────────────────────────────────────────────
function FilterAccordion({
  label,
  options,
  selected,
  onSelect,
  hasBorder = false,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  hasBorder?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={hasBorder ? "border-b border-white/10" : ""}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-3.5 px-6 group transition-colors focus:outline-none hover:bg-white/[0.02] cursor-pointer"
      >
        <span className="text-[14px] font-semibold text-white transition-colors">
          {label}
        </span>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-white/80"}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-black/25"
          >
            <div className="flex flex-col gap-3 pb-4 px-6 pt-2">
              {options.map((opt) => {
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => onSelect(isSelected ? "All" : opt)}
                    className="flex items-center gap-3 w-full text-left group focus:outline-none cursor-pointer"
                  >
                    <div className={`flex items-center justify-center h-[16px] w-[16px] flex-shrink-0 rounded-[4px] border transition-colors ${isSelected ? "border-[#00E58C] bg-[#00E58C]/10 text-[#00E58C]" : "border-white/20 bg-transparent group-hover:border-white/40"}`}>
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className={`text-[14px] transition-colors ${isSelected ? "text-white font-medium" : "text-white/80 group-hover:text-white"}`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CUSTOM_SFX_TRACKS: LibraryTrack[] = [
  {
    id: "sfx-hud-confirm",
    kind: "sfx",
    title: "Sci-Fi HUD Confirm",
    artist: "UI Sounds",
    genre: ["Technology"],
    bpm: "-",
    keySig: "-",
    duration: "0:02",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    moods: ["Sci-Fi"],
    downloads: 320,
    featured: true,
  },
  {
    id: "sfx-metal-door-slam",
    kind: "sfx",
    title: "Heavy Metal Door Slam",
    artist: "Foley Lab",
    genre: ["Impacts"],
    bpm: "-",
    keySig: "-",
    duration: "0:04",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    moods: ["Heavy"],
    downloads: 240,
  },
  {
    id: "sfx-cyberpunk-glitch",
    kind: "sfx",
    title: "Cyberpunk Glitch",
    artist: "Transitions",
    genre: ["Electronics"],
    bpm: "-",
    keySig: "-",
    duration: "0:03",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    moods: ["Tech"],
    downloads: 512,
  },
  {
    id: "sfx-rain-window",
    kind: "sfx",
    title: "Rain on Window",
    artist: "Nature Atmos",
    genre: ["Ambience"],
    bpm: "-",
    keySig: "-",
    duration: "1:20",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    moods: ["Calm"],
    downloads: 480,
  },
  {
    id: "sfx-cinematic-whoosh",
    kind: "sfx",
    title: "Cinematic Whoosh",
    artist: "Sound Design",
    genre: ["Transitions"],
    bpm: "-",
    keySig: "-",
    duration: "0:05",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    moods: ["Epic"],
    downloads: 690,
  },
  {
    id: "sfx-digital-beep",
    kind: "sfx",
    title: "Digital Beep",
    artist: "UI Sounds",
    genre: ["Technology"],
    bpm: "-",
    keySig: "-",
    duration: "0:01",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    moods: ["Digital"],
    downloads: 180,
  },
  {
    id: "sfx-deep-boom",
    kind: "sfx",
    title: "Deep Boom",
    artist: "Impact Lab",
    genre: ["Impacts"],
    bpm: "-",
    keySig: "-",
    duration: "0:06",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    moods: ["Heavy"],
    downloads: 330,
  },
  {
    id: "sfx-windy-forest",
    kind: "sfx",
    title: "Windy Forest",
    artist: "Nature Atmos",
    genre: ["Ambience"],
    bpm: "-",
    keySig: "-",
    duration: "2:15",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    moods: ["Nature"],
    downloads: 290,
  },
];

const FILTER_OPTIONS = {
  categories: [
    "Ambience", "Animals", "Cartoon", "Cinematic", "Destruction", "Electronics", "Elements", "Footsteps",
    "Gaming", "Hits", "Home", "Horror", "Human", "Impacts", "Industry", "Materials", "Movement",
    "Musical", "Office", "Sci-fi", "Sound Design", "Sports", "Technology", "Transitions", "Transportation", "Weapons"
  ],
  moods: ["Digital", "Heavy", "Tech", "Calm", "Epic", "Ambient", "Atmosphere"],
  durations: ["< 5s", "5s - 30s", "> 30s"],
  playlists: [
    "Advertising & Marketing", "Airport", "Backwoods", "Basketball", "Bathroom", "Beeps", "Building Site",
    "Burst", "Cemetery", "Chronograph", "City Soundscapes", "Classic Tech", "Classic Video Games",
    "Closing & Opening", "Construction Yard", "Counting Down", "Creaky Doors", "Damage Control",
    "Dark Cinematic Elements", "Designers Essential UI Sounds", "Dirty Transitions", "Doom & Dread",
    "Drips & Drops", "Dynamic Swishes", "Electronic Transitions", "Empty Rooms", "Flares & Flashes",
    "Flickering Lights", "Footsteps On Sand", "Gentle Rain", "Glitch Out", "Heads Up Display",
    "Heavy Drops", "Heavy Doors", "House & Home", "Incoming Message", "Laser Weaponry",
    "Long Ambient Rumbles", "Magical Spells", "Metal Foley", "Micro Mechanical", "Office",
    "Pushed To The Limit", "Retro UI", "Room Tones", "Say Cheese", "Science Fiction",
    "Social Media", "Sound Design Clips", "Sounds Of Autumn", "Sounds Of Spring", "Sounds of Summer",
    "Spooky Sounds", "Take 5", "Take A Walk", "Trains", "Water", "Weather", "Wedding", "Wildlife",
    "Wind", "Winter Time", "Working 9-5", "Zoom Zoom Zoom"
  ]
};

const SFX_CATEGORIES = [
  {
    title: "Sci-Fi & Cyberpunk",
    count: "64 sounds",
    image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&q=80",
    description: "Advanced telemetry chirps, holographic UI swooshes, warp engines, and robotic activations."
  },
  {
    title: "Foley & Everyday Life",
    count: "128 sounds",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
    description: "Natural rustles, heavy key turnings, footsteps, heavy slamming doors, and environmental foley."
  },
  {
    title: "Nature Ambient Pads",
    count: "45 sounds",
    image: "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=600&q=80",
    description: "Cinematic forest rain, high wind storms, ocean tides, chirping birds, and summer night atmospheres."
  },
  {
    title: "Impacts & Transitions",
    count: "50 sounds",
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80",
    description: "Deep sub drops, thunderous impacts, cinematic whooshes, and sweep risers for video transitions."
  }
];

const SORT_OPTIONS = ["Popular", "Duration"];

export default function SoundEffectsLibraryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Sound Effects");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedPlaylist, setSelectedPlaylist] = useState("All");
  const [sortOption, setSortOption] = useState("Popular");

  const [sfxTracks, setSfxTracks] = useState<LibraryTrack[]>([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const featuredPlaylistRef = React.useRef<HTMLDivElement>(null);

  const scrollFeaturedPlaylists = useCallback((direction: "left" | "right") => {
    const shelf = featuredPlaylistRef.current;
    if (!shelf) return;

    shelf.scrollBy({
      left: direction === "right" ? 520 : -520,
      behavior: "smooth",
    });
  }, []);

  // Load Tracks dynamically from WordPress REST API / Cloudflare R2 Manifest / Hardcoded fallback
  useEffect(() => {
    async function loadTracks() {
      try {
        const response = await apiFetch("/tracks?kind=sfx");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setSfxTracks(data);
          setTracksLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch tracks from WordPress REST API:", err);
      }

      try {
        const data = await getLibraryTracks("sfx");
        if (Array.isArray(data) && data.length > 0) {
          setSfxTracks(data);
          setTracksLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch tracks from R2 manifest:", err);
      }

      setSfxTracks(CUSTOM_SFX_TRACKS);
      setTracksLoading(false);
    }
    loadTracks();
  }, []);

  const { 
    activeTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    likedTrackIds, 
    toggleLike, 
    fetchFavorites 
  } = usePlayerStore();

  const isLoggedIn     = !!session?.user;
  const planTier       = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive   = !!planTier && planTier !== "free";

  // Load User Favorites on Mount
  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    }
  }, [session, fetchFavorites]);

  const handlePlayToggle = useCallback(
    (track: LibraryTrack) => {
      if (activeTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrack({
          id: track.id, title: track.title, artist: track.artist,
          genre: track.genre, bpm: track.bpm, keySig: track.keySig,
          duration: track.duration, image: track.image, audioUrl: track.audioUrl,
          waveform: track.waveform,
        });
      }
    },
    [activeTrack, togglePlay, playTrack]
  );

  const handleDownload = useCallback(async (track: LibraryTrack) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (downloadingId) return;

    setDownloadingId(track.id);
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
      alert(err.message || "Failed to download track. Check subscription status.");
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId, session, router]);

  const handleHeartClick = async (trackId: string) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    try {
      await toggleLike(trackId);
    } catch (err) {
      alert("Failed to update favorite. Please try again.");
    }
  };

  // Filtered & Sorted Tracks
  const filteredTracks = useMemo(() => {
    let result = sfxTracks.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.moods && t.moods.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === "All" || t.genre.includes(selectedCategory);
      const matchesMood = selectedMood === "All" || (t.moods && t.moods.includes(selectedMood));

      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "< 5s" && t.duration && t.duration <= "0:05") ||
        (selectedDuration === "5s - 30s" && t.duration && t.duration > "0:05" && t.duration <= "0:30") ||
        (selectedDuration === "> 30s" && t.duration && t.duration > "0:30");

      const hasCoverArt = !!t.image && t.image.trim() !== "";
      return matchesSearch && matchesCategory && matchesMood && matchesDuration && hasCoverArt;
    });

    if (sortOption === "Duration") {
      result = [...result].sort((a, b) => (a.duration || "").localeCompare(b.duration || ""));
    }
    return result;
  }, [sfxTracks, searchQuery, selectedCategory, selectedMood, selectedDuration, selectedPlaylist, sortOption]);

  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedCategory !== "All") list.push({ key: "category", label: `Category: ${selectedCategory}`, clear: () => setSelectedCategory("All") });
    if (selectedMood !== "All") list.push({ key: "mood", label: `Mood: ${selectedMood}`, clear: () => setSelectedMood("All") });
    if (selectedDuration !== "All") list.push({ key: "duration", label: `Duration: ${selectedDuration}`, clear: () => setSelectedDuration("All") });
    if (selectedPlaylist !== "All") list.push({ key: "playlist", label: `Playlist: ${selectedPlaylist}`, clear: () => setSelectedPlaylist("All") });
    return list;
  }, [selectedCategory, selectedMood, selectedDuration, selectedPlaylist]);

  // ── Infinite Scroll ────────────────────────────────────────────────
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset pagination whenever filters or search change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredTracks]);

  // IntersectionObserver: load next page when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredTracks.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredTracks.length]);

  const visibleTracks = filteredTracks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTracks.length;

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

        <div className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10">
          <h3 className="text-[16px] font-bold text-white tracking-tight">
            Filter By
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="pb-4">
            <FilterAccordion label="Categories" options={FILTER_OPTIONS.categories} selected={selectedCategory} onSelect={setSelectedCategory} hasBorder={true} />
            <FilterAccordion label="Moods" options={FILTER_OPTIONS.moods} selected={selectedMood} onSelect={setSelectedMood} />
            <FilterAccordion label="Durations" options={FILTER_OPTIONS.durations} selected={selectedDuration} onSelect={setSelectedDuration} />
            <FilterAccordion label="Playlists" options={FILTER_OPTIONS.playlists} selected={selectedPlaylist} onSelect={setSelectedPlaylist} />
          </div>
        </div>

        {/* Account Menu Footer (Static at bottom of filter sidebar) */}
        {isLoggedIn && (
          <div className="shrink-0 border-t border-white/[0.06] bg-[#181818] p-3.5">
            <UserDropdown variant="sidebar" planTier={planTier} />
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════ */}
      <div className="flex-grow lg:pl-[260px] flex flex-col min-h-screen w-full relative overflow-hidden z-0">
        {/* Ambient Lights & Cinematic Glows */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[300px] bg-gradient-to-b from-white/[0.04] via-[#FF1E84]/[0.01] to-transparent blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-[250px] left-10 w-[500px] h-[300px] bg-gradient-to-br from-white/[0.02] to-transparent blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-[320px] right-20 w-[600px] h-[350px] bg-gradient-to-bl from-[#FF1E84]/[0.02] to-transparent blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] left-[20%] w-[600px] h-[400px] bg-purple-500/[0.015] blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[400px] bg-white/[0.01] blur-[140px] pointer-events-none -z-10" />

        {/* TOP NAV */}
        <header className="h-[64px] flex items-center justify-between px-6 lg:px-10 bg-[#181818]/95 backdrop-blur-md border-b border-white/[0.07] fixed top-0 left-0 lg:left-[260px] right-0 z-40">
          <div className="flex items-center gap-8">
            <button className="lg:hidden text-white/50 hover:text-white mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {isLoggedIn ? (
                <Link href="/my-account" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors">Dashboard</Link>
              ) : (
                <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors">Discover</Link>
              )}
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors flex items-center gap-1.5">Music <ChevronDown className="h-3 w-3 opacity-60" /></Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white transition-colors flex items-center gap-1.5">Sound Effects <ChevronDown className="h-3 w-3 opacity-60" /></Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            {/* ── Situation 1: Not logged in ── */}
            {!isLoggedIn && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/login" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="h-9 px-5 bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  Get Started
                </Link>
              </>
            )}

            {/* ── Situation 2: Logged in, not subscribed (Free) ── */}
            {isLoggedIn && !isPlanActive && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/pricing" className="h-9 px-5 bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  Subscribe
                </Link>
              </>
            )}

            {/* ── Situation 3: Logged in + subscribed ── */}
            {isLoggedIn && isPlanActive && (
              <>
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors mr-2">
                  Pricing
                </Link>
                <Link href="/library/liked" className="h-9 px-5 bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors">
                  My Library
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 w-full max-w-[1720px] mx-auto overflow-hidden pt-[64px]">

          {/* SEARCH BAR */}
          <section className="px-4 lg:px-6 mt-6">
            <div className="w-full max-w-[1720px] mx-auto">
              <div className="w-full flex items-center gap-2 bg-white/10 border border-white/20 rounded-full p-1.5 shadow-2xl backdrop-blur-xl relative z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors text-[14px] font-medium text-white focus:outline-none shrink-0">
                    {searchType} <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-[#1A1A1A] border-white/20 text-white rounded-xl shadow-xl z-50">
                    <DropdownMenuItem onClick={() => { setSearchType("Music"); router.push("/library/royalty-free-music"); }} className="hover:bg-white/10 cursor-pointer rounded-lg text-[14px] py-2.5">Music</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSearchType("Sound Effects"); }} className="hover:bg-white/10 cursor-pointer rounded-lg text-[14px] py-2.5">Sound Effects</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-px bg-white/20 shrink-0" />

                <div className="flex-1 flex relative h-full">
                  <Search className="h-5 w-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={`Search ${searchType.toLowerCase()}...`}
                    className="w-full h-[48px] rounded-full bg-transparent border-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] text-white placeholder:text-white/60 pl-12 pr-6 shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED PLAYLISTS */}
          <section className="px-4 lg:px-6 mt-7 mb-3">
            <div className="w-full max-w-[1720px] mx-auto">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-[16px] font-bold tracking-tight text-white">Featured Playlists</h2>
                <Link
                  href="/library/collections"
                  className="flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-[11px] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  Browse All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div
                ref={featuredPlaylistRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  {
                    title: "Sci-Fi & Cyberpunk",
                    subtitle: "Digital UI & Engines",
                    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&q=80",
                    keyword: "Sci-Fi"
                  },
                  {
                    title: "Foley & Everyday",
                    subtitle: "Footsteps & Rustles",
                    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80",
                    keyword: "Impacts"
                  },
                  {
                    title: "Nature Ambience",
                    subtitle: "Wind & Forest",
                    image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=500&q=80",
                    keyword: "Ambience"
                  },
                  {
                    title: "Impacts & Drops",
                    subtitle: "Whooshes & Rises",
                    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
                    keyword: "Transitions"
                  },
                  {
                    title: "Horror & Suspense",
                    subtitle: "Creaks & Scrapes",
                    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
                    keyword: "Heavy"
                  },
                  {
                    title: "UI & Alerts",
                    subtitle: "Beeps & Confirms",
                    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
                    keyword: "Digital"
                  },
                  {
                    title: "Industrial & Mach",
                    subtitle: "Factory Tools",
                    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&q=80",
                    keyword: "Tech"
                  },
                  {
                    title: "Weapons & Combat",
                    subtitle: "Sci-Fi Lasers",
                    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&q=80",
                    keyword: "Heavy"
                  },
                  {
                    title: "City Soundscapes",
                    subtitle: "Traffic & Crowds",
                    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80",
                    keyword: "Atmosphere"
                  },
                  {
                    title: "Magic & Spells",
                    subtitle: "Fantasy Elements",
                    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80",
                    keyword: "Calm"
                  },
                  {
                    title: "Space Exploration",
                    subtitle: "Drones & Ambiences",
                    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=80",
                    keyword: "Epic"
                  },
                  {
                    title: "Vehicles & Trans",
                    subtitle: "Engines & Passes",
                    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80",
                    keyword: "Tech"
                  }
                ].map((pl) => (
                  <div 
                    key={pl.title}
                    onClick={() => {
                      setSearchQuery(pl.keyword);
                    }}
                    className="group flex w-[150px] shrink-0 snap-start cursor-pointer flex-col sm:w-[170px] lg:w-[190px] xl:w-[205px]"
                  >
                    {/* Square Cover Art Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900 border border-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-[1.015] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]">
                      <img 
                        src={pl.image} 
                        alt={pl.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      
                      {/* Circular Play Hover Accent */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-[#00E58C] text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105">
                          <Play className="h-4 w-4 fill-black translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata Text Underneath */}
                    <div className="mt-3 text-left">
                      <h4 className="truncate text-[15px] font-bold text-white tracking-normal leading-tight group-hover:text-[#00E58C] transition-colors">
                        {pl.title}
                      </h4>
                      <p className="mt-1 truncate text-[13px] text-white/60 font-normal leading-tight">
                        {pl.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-start gap-2">
                <button
                  type="button"
                  onClick={() => scrollFeaturedPlaylists("left")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                  aria-label="Previous featured playlists"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeaturedPlaylists("right")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                  aria-label="Next featured playlists"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* TRACK LISTING */}
          <section className="px-4 lg:px-6 pt-2 pb-24 w-full">
            <div className="w-full bg-transparent">

              {/* Active Filter Pills Bar */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 text-left select-none">
                  <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mr-1">Active filters:</span>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={filter.clear}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-[#00E58C]/10 text-white/90 hover:text-[#00E58C] border border-white/10 hover:border-[#00E58C]/30 text-xs font-semibold transition-all cursor-pointer group"
                    >
                      {filter.label}
                      <X size={12} className="text-neutral-500 group-hover:text-[#00E58C] transition-colors" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedMood("All");
                      setSelectedDuration("All");
                      setSelectedPlaylist("All");
                    }}
                    className="text-[11px] text-[#00E58C] hover:text-[#00E58C]/80 font-bold uppercase tracking-wider ml-2 transition-colors cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              )}

              {/* Workstation Header Details */}
              <div className="flex items-center justify-between border-b border-white/[0.045] pb-3 mb-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-white tracking-tight">Featured Sounds</h2>
                  <span className="text-xs font-semibold text-neutral-400">({filteredTracks.length} tracks)</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Option Dropdown */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    <span className="text-white/70">Sort by:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 text-white transition-colors hover:text-white/80 focus:outline-none cursor-pointer">
                        <span className="text-white">{sortOption}</span> <ChevronDown className="h-3 w-3 text-white opacity-80" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#111] border-white/10 text-white rounded-xl min-w-[120px] shadow-xl p-1">
                        {SORT_OPTIONS.map((opt) => (
                          <DropdownMenuItem 
                            key={opt} 
                            onClick={() => setSortOption(opt)} 
                            className={`focus:bg-white/10 rounded-lg text-xs px-3 py-2 cursor-pointer ${sortOption === opt ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:text-white"}`}
                          >
                            {opt}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* View Layout Buttons */}
                  <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-lg p-0.5">
                    <button className="p-1.5 rounded-md bg-[#00E58C]/10 text-[#00E58C] hover:text-[#00E58C] transition-colors" title="List View">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-md text-neutral-500 hover:text-white transition-colors" title="Grid View">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {tracksLoading ? (
                // SKELETON LOADING STATE
                <div className="p-8 space-y-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-white/5 rounded-full shrink-0" />
                      <div className="w-12 h-12 bg-white/5 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/5 rounded w-1/4" />
                        <div className="h-3 bg-white/5 rounded w-1/6" />
                      </div>
                      <div className="w-32 h-6 bg-white/5 rounded" />
                      <div className="w-20 h-6 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredTracks.length === 0 ? (
                // NO TRACKS FOUND STATE
                <div className="flex flex-col items-center justify-center text-center py-20 px-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                    <Search className="h-5 w-5 text-white/40" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No tracks found</h3>
                  <p className="text-sm font-medium text-white/40 leading-relaxed max-w-sm">
                    We couldn't find any sound effects matching your search query or filter selections.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedMood("All");
                      setSelectedDuration("All");
                      setSelectedPlaylist("All");
                    }}
                    className="mt-6 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs h-10 px-8 hover:bg-white/90 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                // PREMIUM CREATOR WORKSPACE ROWS
                <div className="w-full">
                  {visibleTracks.map((track) => {
                    const isLiked = likedTrackIds.includes(track.id);

                    return (
                      <TrackRow
                        key={track.id}
                        track={track}
                        activeTrack={activeTrack}
                        isPlaying={isPlaying}
                        isLiked={isLiked}
                        onPlayToggle={handlePlayToggle}
                        onHeartClick={handleHeartClick}
                        onDownload={handleDownload}
                        allTracks={sfxTracks}
                      />
                    );
                  })}

                  {/* Infinite Scroll Sentinel */}
                  <div ref={sentinelRef} className="w-full">
                    {hasMore && (
                      <div className="flex items-center justify-center gap-2 py-8">
                        <div className="h-1 w-1 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
                        <div className="h-1 w-1 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
                        <div className="h-1 w-1 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
