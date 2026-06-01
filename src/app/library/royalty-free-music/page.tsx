"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile, Grid2X2, Zap, Mic2, Music, Clock, Key, Gauge, User, ListMusic,
  ChevronDown, ChevronLeft, ChevronRight, Search, ShoppingCart, Play, Pause, X, Menu,
  Download, Plus, ArrowRight, Check, Heart, LogIn,
  MoreHorizontal, Sparkles
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
            <div className="px-6 py-2.5 pb-4 space-y-2">
              {/* Option 'All' */}
              <label className="flex items-center gap-3 py-1 cursor-pointer select-none text-[13.5px] font-semibold transition-colors hover:text-white text-neutral-400">
                <input
                  type="checkbox"
                  checked={selected === "All"}
                  onChange={() => onSelect("All")}
                  className="rounded border-white/20 bg-transparent text-[#00E58C] focus:ring-offset-0 focus:ring-0 w-3.5 h-3.5"
                />
                All
              </label>

              {options.map((opt) => (
                <label key={opt} className={`flex items-center gap-3 py-1 cursor-pointer select-none text-[13.5px] font-semibold transition-colors hover:text-white ${selected === opt ? "text-[#00E58C]" : "text-neutral-400"}`}>
                  <input
                    type="checkbox"
                    checked={selected === opt}
                    onChange={() => onSelect(selected === opt ? "All" : opt)}
                    className="rounded border-white/20 bg-transparent text-[#00E58C] focus:ring-offset-0 focus:ring-0 w-3.5 h-3.5"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TRACKS: LibraryTrack[] = [
  { id: "mission", kind: "music", title: "Mission", artist: "Nevin", genre: ["Post-Punk Revival"], bpm: 171, keySig: "D Min", duration: "3:34", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", moods: ["Angry", "Dark"], explicit: true, vocals: true, downloads: 980 },
  { id: "civilize", kind: "music", title: "Civilize", artist: "West & Zander", genre: ["Nu Disco", "Deep House"], bpm: 115, keySig: "G Maj", duration: "3:09", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", moods: ["Laid Back", "Smooth"], explicit: false, vocals: false, downloads: 720 },
  { id: "where-wind", kind: "music", title: "Where the Wind", artist: "Mizlo", genre: ["Funk", "Alternative"], bpm: 95, keySig: "F Min", duration: "2:06", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", moods: ["Happy", "Laid Back"], explicit: false, vocals: false, downloads: 640 },
  { id: "ructor-bounce", kind: "music", title: "Ructor Bounce", artist: "Marcus Price", genre: ["Footwork"], bpm: 160, keySig: "A Min", duration: "2:54", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", moods: ["Happy", "Restless"], explicit: false, vocals: false, downloads: 560 },
  { id: "you-are", kind: "music", title: "u Are Whoever", artist: "Cezar", genre: ["Reggae", "Caribbean"], bpm: 80, keySig: "C Maj", duration: "3:04", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", moods: ["Hopeful", "Laid Back"], explicit: false, vocals: true, downloads: 490 },
  { id: "old-shadow", kind: "music", title: "Old Shadow", artist: "Torii Wolf", genre: ["Alternative Pop"], bpm: 170, keySig: "D Min", duration: "3:13", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", moods: ["Dreamy", "Mysterious"], explicit: false, vocals: true, downloads: 870 },
  { id: "sun-and-moon", kind: "music", title: "The Sun and the Moon", artist: "Mukryan Molod", genre: ["Orchestral Hybrid"], bpm: 95, keySig: "Eb Maj", duration: "3:24", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", moods: ["Epic", "Hopeful"], explicit: false, vocals: false, downloads: 1100, featured: true },
  { id: "itll-pass", kind: "music", title: "It'll All Pass", artist: "Torii Wolf", genre: ["Indie Folk"], bpm: 95, keySig: "E Min", duration: "4:27", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", moods: ["Calm"], explicit: false, vocals: true, downloads: 430 },
  { id: "neon-nights", kind: "music", title: "Neon Nights", artist: "Satin Waves", genre: ["Electronic"], bpm: 128, keySig: "G Min", duration: "3:45", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", moods: ["Chill", "Dreamy"], explicit: false, vocals: false, downloads: 810 },
  { id: "city-pulse", kind: "music", title: "City Pulse", artist: "Midnight Theory", genre: ["Hip Hop"], bpm: 90, keySig: "C Min", duration: "2:58", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", moods: ["Restless", "Dark"], explicit: false, vocals: true, downloads: 650 },
  { id: "golden-hour", kind: "music", title: "Golden Hour", artist: "Velvet Motion", genre: ["Acoustic"], bpm: 72, keySig: "D Maj", duration: "3:52", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", moods: ["Calm", "Hopeful"], explicit: false, vocals: true, downloads: 920 },
  { id: "skyward", kind: "music", title: "Skyward", artist: "Epic North", genre: ["Cinematic"], bpm: 108, keySig: "Bb Maj", duration: "4:11", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", moods: ["Epic", "Inspiring"], explicit: false, vocals: false, downloads: 1340, featured: true },
  { id: "coastal-drive", kind: "music", title: "Coastal Drive", artist: "Sunset Sons", genre: ["Indie", "Pop"], bpm: 118, keySig: "A Maj", duration: "3:20", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", moods: ["Happy", "Uplifting"], explicit: false, vocals: true, downloads: 780 },
  { id: "deep-forest", kind: "music", title: "Deep Forest", artist: "Shadow Work", genre: ["Ambient"], bpm: 65, keySig: "F Maj", duration: "5:02", image: "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", moods: ["Calm", "Reflective"], explicit: false, vocals: false, downloads: 390 },
  { id: "urban-bloom", kind: "music", title: "Urban Bloom", artist: "BeatFuel", genre: ["R&B"], bpm: 85, keySig: "G Maj", duration: "3:37", image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", moods: ["Smooth", "Romantic"], explicit: false, vocals: true, downloads: 550 },
  { id: "pulse-drive", kind: "music", title: "Pulse Drive", artist: "Minimal State", genre: ["Electronic", "Techno"], bpm: 138, keySig: "A Min", duration: "4:00", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", moods: ["Intense", "Restless"], explicit: false, vocals: false, downloads: 710 },
  { id: "jazz-cafe", kind: "music", title: "Jazz Café", artist: "Velvet Motion", genre: ["Jazz"], bpm: 92, keySig: "Db Maj", duration: "3:15", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", moods: ["Laid Back", "Sophisticated"], explicit: false, vocals: false, downloads: 480 },
  { id: "spring-rise", kind: "music", title: "Spring Rise", artist: "Sunset Sons", genre: ["Folk"], bpm: 100, keySig: "E Maj", duration: "2:48", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", moods: ["Happy", "Hopeful"], explicit: false, vocals: true, downloads: 610 },
  { id: "midnight-run", kind: "music", title: "Midnight Run", artist: "Midnight Theory", genre: ["Cinematic", "Orchestral Hybrid"], bpm: 112, keySig: "D Min", duration: "3:56", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", moods: ["Dark", "Intense"], explicit: false, vocals: false, downloads: 820 },
  { id: "lo-fi-rain", kind: "music", title: "Lo-Fi Rain", artist: "Shadow Work", genre: ["Electronic"], bpm: 75, keySig: "C Maj", duration: "3:30", image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", moods: ["Chill", "Calm"], explicit: false, vocals: false, downloads: 960, featured: true },
  { id: "anthem-rise", kind: "music", title: "Anthem Rise", artist: "Epic North", genre: ["Cinematic"], bpm: 122, keySig: "Bb Maj", duration: "4:18", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", moods: ["Epic", "Inspiring"], explicit: false, vocals: false, downloads: 1250, featured: true },
  { id: "indie-road", kind: "music", title: "Indie Road", artist: "Satin Waves", genre: ["Indie"], bpm: 104, keySig: "G Maj", duration: "3:05", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", moods: ["Happy", "Laid Back"], explicit: false, vocals: true, downloads: 430 },
  { id: "soul-fire", kind: "music", title: "Soul Fire", artist: "BeatFuel", genre: ["Soul / Motown"], bpm: 96, keySig: "F Min", duration: "3:41", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", moods: ["Soulful", "Romantic"], explicit: false, vocals: true, downloads: 690 },
  { id: "crystal-wave", kind: "music", title: "Crystal Wave", artist: "Minimal State", genre: ["Electronic"], bpm: 124, keySig: "A Min", duration: "3:22", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", moods: ["Chill", "Dreamy"], explicit: false, vocals: false, downloads: 510 },
  { id: "thunder-clap", kind: "music", title: "Thunder Clap", artist: "Marcus Price", genre: ["Rock"], bpm: 145, keySig: "E Min", duration: "2:59", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", moods: ["Angry", "Intense"], explicit: false, vocals: true, downloads: 770 },
  { id: "dream-state", kind: "music", title: "Dream State", artist: "Torii Wolf", genre: ["Alternative Pop"], bpm: 88, keySig: "Eb Maj", duration: "3:48", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", moods: ["Dreamy", "Calm"], explicit: false, vocals: true, downloads: 620 },
  { id: "piano-dawn", kind: "music", title: "Piano at Dawn", artist: "Velvet Motion", genre: ["Classical"], bpm: 58, keySig: "G Maj", duration: "4:35", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", moods: ["Calm", "Reflective"], explicit: false, vocals: false, downloads: 840 },
  { id: "heatwave", kind: "music", title: "Heatwave", artist: "West & Zander", genre: ["Nu Disco"], bpm: 120, keySig: "F Maj", duration: "3:18", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", moods: ["Happy", "Uplifting"], explicit: false, vocals: true, downloads: 590 },
  { id: "galaxy-drift", kind: "music", title: "Galaxy Drift", artist: "Epic North", genre: ["Cinematic", "Ambient"], bpm: 78, keySig: "C Min", duration: "5:14", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", moods: ["Epic", "Reflective"], explicit: false, vocals: false, downloads: 1070, featured: true },
  { id: "blues-highway", kind: "music", title: "Blues Highway", artist: "Cezar", genre: ["Blues"], bpm: 82, keySig: "E Min", duration: "4:02", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", moods: ["Reflective", "Soulful"], explicit: false, vocals: true, downloads: 360 },
  { id: "festival-light", kind: "music", title: "Festival Light", artist: "BeatFuel", genre: ["Electronic", "Pop"], bpm: 132, keySig: "D Maj", duration: "3:10", image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", moods: ["Happy", "Uplifting"], explicit: false, vocals: true, downloads: 880 },
  { id: "cold-morning", kind: "music", title: "Cold Morning", artist: "Shadow Work", genre: ["Indie Folk"], bpm: 68, keySig: "A Min", duration: "3:55", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", moods: ["Calm", "Sad"], explicit: false, vocals: true, downloads: 420 },
  { id: "trap-city", kind: "music", title: "Trap City", artist: "Midnight Theory", genre: ["Hip Hop"], bpm: 148, keySig: "G Min", duration: "2:44", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", moods: ["Intense", "Restless"], explicit: true, vocals: true, downloads: 760 },
  { id: "string-theory", kind: "music", title: "String Theory", artist: "Mukryan Molod", genre: ["Classical", "Cinematic"], bpm: 102, keySig: "Db Maj", duration: "4:44", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", moods: ["Epic", "Inspiring"], explicit: false, vocals: false, downloads: 930 },
  { id: "summer-vibes", kind: "music", title: "Summer Vibes", artist: "Sunset Sons", genre: ["Pop", "Indie"], bpm: 110, keySig: "C Maj", duration: "3:28", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", moods: ["Happy", "Laid Back"], explicit: false, vocals: true, downloads: 830 },
  { id: "war-drums", kind: "music", title: "War Drums", artist: "Epic North", genre: ["Cinematic"], bpm: 135, keySig: "D Min", duration: "3:06", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", moods: ["Intense", "Epic"], explicit: false, vocals: false, downloads: 1020 },
  { id: "morning-coffee", kind: "music", title: "Morning Coffee", artist: "Velvet Motion", genre: ["Jazz", "Acoustic"], bpm: 88, keySig: "F Maj", duration: "2:52", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", moods: ["Calm", "Laid Back"], explicit: false, vocals: false, downloads: 490 },
  { id: "voltage", kind: "music", title: "Voltage", artist: "Minimal State", genre: ["Electronic", "Techno"], bpm: 142, keySig: "A Min", duration: "3:39", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", moods: ["Intense", "Restless"], explicit: false, vocals: false, downloads: 660 },
  { id: "gospel-grace", kind: "music", title: "Gospel Grace", artist: "Cezar", genre: ["Gospel"], bpm: 92, keySig: "Bb Maj", duration: "4:05", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", moods: ["Inspiring", "Hopeful"], explicit: false, vocals: true, downloads: 380 },
  { id: "retro-arcade", kind: "music", title: "Retro Arcade", artist: "BeatFuel", genre: ["Electronic"], bpm: 130, keySig: "C Maj", duration: "2:33", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", moods: ["Fun", "Happy"], explicit: false, vocals: false, downloads: 740 },
  { id: "world-beat", kind: "music", title: "World Beat", artist: "Mizlo", genre: ["World"], bpm: 98, keySig: "G Maj", duration: "3:47", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", moods: ["Happy", "Uplifting"], explicit: false, vocals: true, downloads: 570 },
];

const FILTER_OPTIONS = {
  collections: ["Featured", "New Releases", "Staff Picks", "Trending"],
  moods: ["Angry", "Calm", "Chill", "Fun", "Happy", "Hopeful", "Inspiring", "Quirky", "Reflective", "Romantic", "Sad", "Scary", "Suspenseful"],
  characteristics: ["Aggressive", "Atmospheric", "Beautiful", "Building", "Chaotic", "Childlike", "Cruising", "Dancey", "Dark", "Dreamy", "Droning", "Dynamic", "Epic", "Intense", "Mellow", "Minimal", "Rebellious", "Retro", "Soaring", "Sophisticated", "Soulful", "Upbeat"],
  genres: ["Acoustic", "Ballad", "Blues", "Cinematic", "Classical", "Corporate", "Country", "Electronic", "Experimental", "Folk", "Funk", "Gospel", "Hip Hop", "Holiday", "Indie", "Jazz", "Pop", "R&B", "Rock", "Soul / Motown", "Soundtrack / Cinematic", "World"],
  energy: ["Low", "Medium", "High"],
  instruments: ["Piano", "Strings", "Guitar", "Synth", "Drums"],
  vocals: ["Instrumental", "Male Vocal", "Female Vocal", "Choir"],
  durations: ["< 2:30", "2:30 – 3:15", "3:15 – 4:00", "> 4:00"],
  keys: ["Db Maj", "G Maj", "F Min", "A Min", "C Maj", "D Min", "Eb Maj", "E Min"],
  bpms: ["< 80", "80 – 100", "100 – 120", "> 120"],
  artists: ["Satin Waves", "Midnight Theory", "Velvet Motion", "Epic North", "Sunset Sons", "Shadow Work", "Minimal State", "BeatFuel"],
  playlists: ["Tracknit Sessions", "Cinematic Vibes", "Chill & Focus", "Urban Flow", "Uplifting Anthems"],
};

const SORT_OPTIONS = ["Popular", "Latest", "Trending", "BPM", "Duration"];

const parseDurationSeconds = (duration?: string) => {
  if (!duration) return 0;
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
};

export default function RoyaltyFreeMusicPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Music");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [selectedCharacteristic, setSelectedCharacteristic] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedEnergy, setSelectedEnergy] = useState("All");
  const [selectedInstrument, setSelectedInstrument] = useState("All");
  const [selectedKey, setSelectedKey] = useState("All");
  const [selectedArtist, setSelectedArtist] = useState("All");
  const [selectedPlaylist, setSelectedPlaylist] = useState("All");
  const [selectedVocal, setSelectedVocal] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [sortOption, setSortOption] = useState("Popular");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [tracks, setTracks] = useState<LibraryTrack[]>([]);
  const [tracksLoading, setTracksLoading] = useState(true);
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
        const response = await apiFetch("/tracks?kind=music");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
          setTracksLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch tracks from WordPress REST API:", err);
      }

      try {
        const data = await getLibraryTracks("music");
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
          setTracksLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch tracks from R2 manifest:", err);
      }

      setTracks(TRACKS);
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

  const isLoggedIn    = !!session?.user;
  const planTier      = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive  = !!planTier && planTier !== "free";

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
    const parseDurationToSeconds = (durationStr?: string): number => {
      if (!durationStr) return 0;
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
      return Number(durationStr) || 0;
    };

    let result = tracks.filter((t) => {
      const trackGenres = t.genre ?? [];
      const trackMoods = t.moods ?? [];
      const trackUseCases = t.useCases ?? [];
      const trackTags = t.tags ?? [];

      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trackGenres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        trackMoods.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCollection = selectedCollection === "All" || trackGenres.includes(selectedCollection);
      const matchesMood = selectedMood === "All" || trackMoods.includes(selectedMood);
      const matchesCharacteristic = selectedCharacteristic === "All" || trackUseCases.includes(selectedCharacteristic);
      const matchesGenre = selectedGenre === "All" || trackGenres.includes(selectedGenre);
      const matchesEnergy = selectedEnergy === "All" || trackTags.includes(selectedEnergy);
      const matchesInstrument = selectedInstrument === "All" || trackTags.includes(selectedInstrument);
      const matchesKey = selectedKey === "All" || t.keySig === selectedKey;
      const matchesArtist = selectedArtist === "All" || t.artist === selectedArtist;
      const matchesPlaylist = selectedPlaylist === "All" || trackTags.includes(selectedPlaylist);
      const matchesVocal = selectedVocal === "All" || (selectedVocal === "Instrumental" ? !t.vocals : t.vocals);
      
      const seconds = parseDurationToSeconds(t.duration);
      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "< 2:30" && seconds < 150) ||
        (selectedDuration === "2:30 – 3:15" && seconds >= 150 && seconds <= 195) ||
        (selectedDuration === "3:15 – 4:00" && seconds >= 195 && seconds <= 240) ||
        (selectedDuration === "> 4:00" && seconds > 240);

      const hasCoverArt = !!t.image && t.image.trim() !== "";

      return (
        matchesSearch &&
        matchesCollection &&
        matchesMood &&
        matchesCharacteristic &&
        matchesGenre &&
        matchesEnergy &&
        matchesInstrument &&
        matchesKey &&
        matchesArtist &&
        matchesPlaylist &&
        matchesVocal &&
        matchesDuration &&
        hasCoverArt
      );
    });

    if (sortOption === "Popular") {
      result = [...result].sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0));
    } else if (sortOption === "Latest") {
      result = [...result].sort((a, b) => tracks.indexOf(b) - tracks.indexOf(a));
    } else if (sortOption === "Trending") {
      result = [...result].sort((a, b) => {
        const featuredScore = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredScore !== 0) return featuredScore;
        return (Number(b.downloads) || 0) - (Number(a.downloads) || 0);
      });
    } else if (sortOption === "BPM") {
      result = [...result].sort((a, b) => (Number(a.bpm) || 0) - (Number(b.bpm) || 0));
    } else if (sortOption === "Duration") {
      result = [...result].sort((a, b) => parseDurationSeconds(a.duration) - parseDurationSeconds(b.duration));
    }
    return result;
  }, [
    tracks,
    searchQuery,
    selectedCollection,
    selectedMood,
    selectedCharacteristic,
    selectedGenre,
    selectedEnergy,
    selectedInstrument,
    selectedKey,
    selectedArtist,
    selectedPlaylist,
    selectedVocal,
    selectedDuration,
    sortOption,
  ]);

  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedCollection !== "All") list.push({ key: "collection", label: `Collection: ${selectedCollection}`, clear: () => setSelectedCollection("All") });
    if (selectedMood !== "All") list.push({ key: "mood", label: `Mood: ${selectedMood}`, clear: () => setSelectedMood("All") });
    if (selectedCharacteristic !== "All") list.push({ key: "characteristic", label: `Style: ${selectedCharacteristic}`, clear: () => setSelectedCharacteristic("All") });
    if (selectedGenre !== "All") list.push({ key: "genre", label: `Genre: ${selectedGenre}`, clear: () => setSelectedGenre("All") });
    if (selectedEnergy !== "All") list.push({ key: "energy", label: `Energy: ${selectedEnergy}`, clear: () => setSelectedEnergy("All") });
    if (selectedInstrument !== "All") list.push({ key: "instrument", label: `Instrument: ${selectedInstrument}`, clear: () => setSelectedInstrument("All") });
    if (selectedKey !== "All") list.push({ key: "key", label: `Key: ${selectedKey}`, clear: () => setSelectedKey("All") });
    if (selectedArtist !== "All") list.push({ key: "artist", label: `Artist: ${selectedArtist}`, clear: () => setSelectedArtist("All") });
    if (selectedPlaylist !== "All") list.push({ key: "playlist", label: `Playlist: ${selectedPlaylist}`, clear: () => setSelectedPlaylist("All") });
    if (selectedVocal !== "All") list.push({ key: "vocal", label: `Vocals: ${selectedVocal}`, clear: () => setSelectedVocal("All") });
    if (selectedDuration !== "All") list.push({ key: "duration", label: `Duration: ${selectedDuration}`, clear: () => setSelectedDuration("All") });
    return list;
  }, [
    selectedCollection, selectedMood, selectedCharacteristic, selectedGenre,
    selectedEnergy, selectedInstrument, selectedKey, selectedArtist,
    selectedPlaylist, selectedVocal, selectedDuration
  ]);

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
            <FilterAccordion label="Collections" options={FILTER_OPTIONS.collections} selected={selectedCollection} onSelect={setSelectedCollection} hasBorder={true} />
            <FilterAccordion label="Mood" options={FILTER_OPTIONS.moods} selected={selectedMood} onSelect={setSelectedMood} />
            <FilterAccordion label="Characteristic" options={FILTER_OPTIONS.characteristics} selected={selectedCharacteristic} onSelect={setSelectedCharacteristic} />
            <FilterAccordion label="Genre" options={FILTER_OPTIONS.genres} selected={selectedGenre} onSelect={setSelectedGenre} />
            <FilterAccordion label="Energy" options={FILTER_OPTIONS.energy} selected={selectedEnergy} onSelect={setSelectedEnergy} />
            <FilterAccordion label="Instrument" options={FILTER_OPTIONS.instruments} selected={selectedInstrument} onSelect={setSelectedInstrument} />
            <FilterAccordion label="Key" options={FILTER_OPTIONS.keys} selected={selectedKey} onSelect={setSelectedKey} />
            <FilterAccordion label="Artist" options={FILTER_OPTIONS.artists} selected={selectedArtist} onSelect={setSelectedArtist} />
            <FilterAccordion label="Playlist" options={FILTER_OPTIONS.playlists} selected={selectedPlaylist} onSelect={setSelectedPlaylist} />
            <FilterAccordion label="Vocals / Inst" options={FILTER_OPTIONS.vocals} selected={selectedVocal} onSelect={setSelectedVocal} />
            <FilterAccordion label="Duration" options={FILTER_OPTIONS.durations} selected={selectedDuration} onSelect={setSelectedDuration} />
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
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white transition-colors flex items-center gap-1.5">Music <ChevronDown className="h-3 w-3 opacity-60" /></Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white flex items-center gap-1.5 transition-colors">Sound Effects <ChevronDown className="h-3 w-3 opacity-60" /></Link>
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
                    <DropdownMenuItem onClick={() => { setSearchType("Music"); }} className="hover:bg-white/10 cursor-pointer rounded-lg text-[14px] py-2.5">Music</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSearchType("Sound Effects"); router.push("/library/sound-effects"); }} className="hover:bg-white/10 cursor-pointer rounded-lg text-[14px] py-2.5">Sound Effects</DropdownMenuItem>
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
                    title: "New Artists",
                    subtitle: "Fresh voices",
                    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&q=80",
                    keyword: "Vocal"
                  },
                  {
                    title: "Made Us Move",
                    subtitle: "Rhythm picks",
                    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80",
                    keyword: "Cinematic"
                  },
                  {
                    title: "Trending Socials",
                    subtitle: "Creator-ready",
                    image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=500&q=80",
                    keyword: "Dance"
                  },
                  {
                    title: "Spring Wedding",
                    subtitle: "Soft & romantic",
                    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
                    keyword: "Pop"
                  },
                  {
                    title: "Dramatic Strings",
                    subtitle: "Cinema tension",
                    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
                    keyword: "World"
                  },
                  {
                    title: "Best Of Tracknit",
                    subtitle: "Editor picks",
                    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
                    keyword: "Featured"
                  },
                  {
                    title: "Lo-Fi Focus",
                    subtitle: "Study beats",
                    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&q=80",
                    keyword: "Chill"
                  },
                  {
                    title: "Indie Roads",
                    subtitle: "Travel cuts",
                    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&q=80",
                    keyword: "Indie"
                  },
                  {
                    title: "Night Drive",
                    subtitle: "Neon pulses",
                    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80",
                    keyword: "Electronic"
                  },
                  {
                    title: "Acoustic Warmth",
                    subtitle: "Natural scenes",
                    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80",
                    keyword: "Acoustic"
                  },
                  {
                    title: "Epic Trailers",
                    subtitle: "Big builds",
                    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=80",
                    keyword: "Epic"
                  },
                  {
                    title: "Minimal Tech",
                    subtitle: "Clean motion",
                    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80",
                    keyword: "Minimal"
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
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Previous featured playlists"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeaturedPlaylists("right")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
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
                      setSelectedCollection("All");
                      setSelectedMood("All");
                      setSelectedCharacteristic("All");
                      setSelectedGenre("All");
                      setSelectedEnergy("All");
                      setSelectedInstrument("All");
                      setSelectedKey("All");
                      setSelectedArtist("All");
                      setSelectedPlaylist("All");
                      setSelectedVocal("All");
                      setSelectedDuration("All");
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
                  <h2 className="text-[16px] font-bold text-white tracking-tight">Featured Songs</h2>
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
                    We couldn't find any music tracks matching your search query or filter selections.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCollection("All");
                      setSelectedMood("All");
                      setSelectedCharacteristic("All");
                      setSelectedGenre("All");
                      setSelectedEnergy("All");
                      setSelectedInstrument("All");
                      setSelectedKey("All");
                      setSelectedArtist("All");
                      setSelectedPlaylist("All");
                      setSelectedVocal("All");
                      setSelectedDuration("All");
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
                        allTracks={tracks}
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
