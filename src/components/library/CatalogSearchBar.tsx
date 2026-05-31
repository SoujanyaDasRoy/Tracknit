"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X, Play, Pause, Music, Zap, Clock, Star, History } from "lucide-react";

// Mock tracks database for instant suggestions
const SUGGESTED_TRACKS = [
  { id: "s-1", title: "Celestial Drift", artist: "Aetherial", category: "Ambient", duration: "2:45", type: "Music" },
  { id: "s-2", title: "Cyber Sunset", artist: "RetroFuture", category: "Synthwave", duration: "3:12", type: "Music" },
  { id: "s-3", title: "Apex Predator", artist: "Volcanic Drums", category: "Cinematic", duration: "2:18", type: "Music" },
  { id: "s-4", title: "City Lights", artist: "Velvet Motion", category: "Chillout", duration: "3:05", type: "Music" },
  { id: "s-5", title: "Neon Impulse", artist: "Grid Runner", category: "Cyberpunk", duration: "2:58", type: "Music" },
  { id: "s-6", title: "Sub-Bass Drop 01", artist: "Studio SFX", category: "Impacts", duration: "0:04", type: "Sound Effects" },
  { id: "s-7", title: "Laser Gate Hum", artist: "Studio SFX", category: "Sci-Fi", duration: "0:12", type: "Sound Effects" },
  { id: "s-8", title: "Atmospheric Riser", artist: "Vortex Foley", category: "Transitions", duration: "0:08", type: "Sound Effects" }
];

const RECENT_SEARCHES = ["retro future", "cinematic riser", "ambient drone", "foley wind"];

const POPULAR_TAGS = {
  "Music": ["Cinematic", "Ambient", "Synthwave", "Chillout", "Action"],
  "Sound Effects": ["Transitions", "Sci-Fi", "Foley", "Impacts", "Sub-Bass"]
};

interface CatalogSearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchType: "Music" | "Sound Effects";
}

export function CatalogSearchBar({
  searchQuery,
  setSearchQuery,
  searchType
}: CatalogSearchBarProps) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close suggestions overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchTypeChange = (newType: "Music" | "Sound Effects") => {
    setDropdownOpen(false);
    if (newType === searchType) return;

    const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : "";
    if (newType === "Music") {
      router.push(`/library/royalty-free-music${queryParam}`);
    } else {
      router.push(`/library/sound-effects${queryParam}`);
    }
  };

  const handlePlayPause = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  // Sync searchQuery from URL on mount if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, []);

  // Filter mock tracks based on input
  const filteredSuggestions = SUGGESTED_TRACKS.filter(track => {
    if (!searchQuery) return false;
    const matchesQuery = 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery && track.type === searchType;
  }).slice(0, 3);

  const showSuggestions = isFocused && searchQuery.length > 0;

  return (
    <div ref={containerRef} className="w-full relative z-30 font-sans">
      {/* ─── Search input wrapper ─── */}
      <div 
        className={[
          "w-full flex items-center gap-2 p-1.5 rounded-full backdrop-blur-xl transition-all duration-300 relative",
          "bg-[#18191B]/80 hover:bg-[#18191B]",
          isFocused 
            ? "border border-[#7CFF00]/30 shadow-[0_0_24px_rgba(124,255,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.05)]" 
            : "border border-white/[0.08]"
        ].join(" ")}
      >
        {/* Search type dropdown toggle selector */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 rounded-full hover:bg-white/[0.04] transition-all text-[13.5px] font-bold text-white uppercase tracking-wider focus:outline-none cursor-pointer select-none"
          >
            {searchType === "Music" ? <Music className="h-4 w-4 text-[#7CFF00] shrink-0" /> : <Zap className="h-4 w-4 text-primary shrink-0" />}
            <span>{searchType}</span>
            <ChevronDown className={`h-3.5 w-3.5 opacity-55 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-2 mt-2 w-48 p-1.5 bg-[#222428]/98 border border-white/[0.08] backdrop-blur-2xl rounded-2xl shadow-2xl z-50 flex flex-col gap-0.5"
              >
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("Music")}
                  className={[
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
                    searchType === "Music" ? "bg-white/[0.04] text-[#7CFF00]" : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                  ].join(" ")}
                >
                  <Music className="h-4 w-4 shrink-0" />
                  <span>Music Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("Sound Effects")}
                  className={[
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
                    searchType === "Sound Effects" ? "bg-white/[0.04] text-[#7CFF00]" : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                  ].join(" ")}
                >
                  <Zap className="h-4 w-4 shrink-0" />
                  <span>Sound Effects</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator line */}
        <div className="h-7 w-px bg-white/[0.08] shrink-0" />

        {/* Primary Input field */}
        <div className="flex-1 flex items-center relative h-full">
          <Search className={`h-4.5 w-4.5 absolute left-4 transition-colors duration-300 ${isFocused ? "text-[#7CFF00] drop-shadow-[0_0_6px_rgba(124,255,0,0.4)]" : "text-white/40"}`} />
          <input
            type="text"
            onFocus={() => setIsFocused(true)}
            placeholder={`Search ${searchType.toLowerCase()} by key, vibe, instrument or bpm...`}
            className="w-full h-11 bg-transparent border-none outline-none focus:outline-none text-[14px] font-medium text-white placeholder:text-white/35 pl-11 pr-10 shadow-none font-sans"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Quick Clear button */}
          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 h-6 w-6 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer focus:outline-none"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Autocomplete suggestions overlay panel ─── */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 p-4 bg-[#222428]/98 border border-white/[0.08] backdrop-blur-3xl rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-40 overflow-hidden"
          >
            {/* Ambient overlay light */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/[0.015] blur-[40px] pointer-events-none rounded-full" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Left Column: matching suggestions */}
              <div className="md:col-span-3 space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-[#F0F5ED]/40 uppercase flex items-center gap-1.5 px-1 select-none">
                  <Star size={11} className="text-primary" /> Instant matches
                </h4>
                
                {filteredSuggestions.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {filteredSuggestions.map(track => {
                      const isPlaying = playingTrackId === track.id;
                      return (
                        <div 
                          key={track.id} 
                          onClick={() => { setSearchQuery(track.title); setIsFocused(false); }}
                          className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => handlePlayPause(e, track.id)}
                              className={[
                                "h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer",
                                isPlaying 
                                  ? "bg-white border-white text-black scale-95" 
                                  : "bg-white/[0.03] border-white/5 text-white/50 hover:bg-white hover:text-black hover:border-white group-hover:bg-white group-hover:text-black group-hover:border-white"
                              ].join(" ")}
                            >
                              {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current translate-x-[0.5px]" />}
                            </button>
                            <div className="min-w-0">
                              <h5 className="text-[13px] font-bold text-white leading-tight truncate">{track.title}</h5>
                              <p className="text-[11px] text-neutral-500 font-semibold mt-0.5 truncate">{track.artist}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-neutral-500 text-[11px] font-semibold">
                            <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9.5px]">
                              {track.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="opacity-40" /> {track.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-[12px] font-semibold text-neutral-500 select-none">
                    No instant matches for "{searchQuery}". Press Enter to search overall.
                  </div>
                )}
              </div>

              {/* Middle Divider */}
              <div className="hidden md:block w-px bg-white/[0.05] h-full shrink-0 col-span-1 justify-self-center" />

              {/* Right Column: Popular Tags & History */}
              <div className="md:col-span-1 space-y-5">
                {/* Popular tags */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold tracking-widest text-[#F0F5ED]/40 uppercase px-1 select-none">
                    Filtered Categories
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_TAGS[searchType].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => { setSearchQuery(tag); setIsFocused(false); }}
                        className="text-[10.5px] font-semibold text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-2.5 py-1 rounded-full transition-all cursor-pointer focus:outline-none"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent search items */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold tracking-widest text-[#F0F5ED]/40 uppercase px-1 select-none flex items-center gap-1">
                    <History size={11} /> Recents
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {RECENT_SEARCHES.map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { setSearchQuery(item); setIsFocused(false); }}
                        className="text-[11.5px] font-medium text-left text-neutral-500 hover:text-[#7CFF00] transition-colors truncate focus:outline-none cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white/[0.12] group-hover:bg-[#7CFF00] shrink-0" />
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
