"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, Music2, Disc, Play, Pause, Search, ArrowLeft, 
  Sparkles, CheckCircle2, Heart, Share2, Globe, Radio, ExternalLink
} from "lucide-react";
import { useTrackStore } from "@/store/useTrackStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { TrackRow } from "@/components/library/TrackRow";

// Simulated Artist Biographies & Stats
const ARTIST_BIOS: Record<string, {
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  listeners: string;
  followers: string;
  genre: string;
  handles: string[];
}> = {
  "lunar-architect": {
    name: "Lunar Architect",
    bio: " Lunar Architect is an electronic sound explorer, crafting ethereal and dreamy ambient soundscapes from analog synthesizer loops and sub-bass depths.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    listeners: "48,312",
    followers: "12,904",
    genre: "Ambient Electronic",
    handles: ["@lunararch", "lunar-architect.com"]
  },
  "vector-field": {
    name: "Vector Field",
    bio: "Vector Field delivers heavy, industrial techno beats and aggressive driving synthesis. Focused on intense cinematic trailer backdrops and cybernetic gaming audio.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    listeners: "92,108",
    followers: "31,450",
    genre: "Industrial Techno",
    handles: ["@vectorfield", "vectorbeats.io"]
  },
  "chrome-pulse": {
    name: "Chrome Pulse",
    bio: "A retro synthwave collective bringing the nostalgic energy of the 80s into the modern decade. Driving synth lines, pulsing drums, and cinematic guitar solos.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
    banner: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1200&q=80",
    listeners: "64,250",
    followers: "18,412",
    genre: "Retro Synthwave",
    handles: ["@chromepulse", "chromepulse.retro"]
  },
  "dylan-sitts": {
    name: "Dylan Sitts",
    bio: "A classical crossover composer blending delicate piano melodies, rich string arrangements, and modern cinematic ambient textures to deliver emotional film backdrops.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    banner: "https://images.unsplash.com/photo-1614613535308-f4c0ba474cdd?w=1200&q=80",
    listeners: "31,894",
    followers: "9,250",
    genre: "Classical Crossover",
    handles: ["@dylansitts", "dylansittsComposer.com"]
  },
  "dreem": {
    name: "dreem",
    bio: "Garage and restless beat-maker composing gritty, heavy-hitting percussion and deep sub grooves for gaming, sports, and intense high-energy trailer scenes.",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80",
    banner: "https://images.unsplash.com/photo-1621609761367-85b46e34ac11?w=1200&q=80",
    listeners: "114,840",
    followers: "42,109",
    genre: "Garage Beats",
    handles: ["@dreembeats", "dreem.audio"]
  }
};

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string || "lunar-architect";
  
  // Normalize id keys
  const id = rawId.toLowerCase();

  const { tracks } = useTrackStore();
  const { activeTrack, isPlaying, playTrack, likedTrackIds, toggleLike } = usePlayerStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch artist profile information or provide premium fallback
  const artist = useMemo(() => {
    return ARTIST_BIOS[id] || {
      name: id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      bio: `${id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} is a professional creator on Tracknit, delivering premium high-fidelity music licensing edits to global creators.`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      banner: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1200&q=80",
      listeners: "12,450",
      followers: "3,120",
      genre: "Premium Creator",
      handles: [`@${id}`, `tracknit.com/artist/${id}`]
    };
  }, [id]);

  // Find all tracks belonging to this artist
  const artistTracks = useMemo(() => {
    return tracks.filter(t => {
      // Direct substring match for multi-artist credits (e.g. "Lunar Architect, Sol")
      return t.artist.toLowerCase().includes(artist.name.toLowerCase()) || 
             t.artist.toLowerCase().replace(/\s/g, "-").includes(id);
    });
  }, [tracks, artist.name, id]);

  // Filtered list
  const filteredTracks = useMemo(() => {
    return artistTracks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [artistTracks, searchQuery]);

  // Map to LibraryTrack shape for TrackRow compatibility
  const libraryTracks = useMemo(() => {
    return filteredTracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      genre: t.genre,
      bpm: t.bpm.toString(),
      keySig: t.keySig,
      duration: t.duration,
      image: t.image,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo fallback
      kind: "music" as "music" | "sfx",
      vocals: t.vocals || false,
      instruments: t.instruments || [],
      moods: t.moods || [],
      useCases: t.useCases || []
    }));
  }, [filteredTracks]);

  const handlePlayArtistPopular = () => {
    if (libraryTracks.length > 0) {
      playTrack({
        id: libraryTracks[0].id,
        title: libraryTracks[0].title,
        artist: libraryTracks[0].artist,
        genre: libraryTracks[0].genre,
        bpm: libraryTracks[0].bpm,
        keySig: libraryTracks[0].keySig,
        duration: libraryTracks[0].duration,
        image: libraryTracks[0].image,
        audioUrl: libraryTracks[0].audioUrl
      });
    }
  };

  const isCurrentArtistPlaying = useMemo(() => {
    if (!activeTrack) return false;
    return activeTrack.artist.toLowerCase().includes(artist.name.toLowerCase());
  }, [activeTrack, artist.name]);

  return (
    <div className="min-h-screen bg-[#070709] text-white font-body pb-24">
      {/* Immersive Artist Banner */}
      <div className="h-[280px] md:h-[380px] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/30 to-transparent z-10" />
        <img 
          src={artist.banner} 
          alt="" 
          className="w-full h-full object-cover scale-105 filter blur-[1px] saturate-[1.1] brightness-[0.7]" 
        />
        
        {/* Back Link */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-6 md:left-10 z-20 h-10 px-4 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Profile Info Header Container */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 -mt-20 md:-mt-28 relative z-20 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
            {/* Frosted Glass Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-white/[0.12] shadow-2xl p-1 bg-white/[0.03] backdrop-blur-md">
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-[#7CFF00]/15 text-[#7CFF00] px-2.5 py-0.5 rounded border border-[#7CFF00]/25 uppercase tracking-widest leading-none">
                  Verified Artist
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-none tracking-tight">{artist.name}</h1>
              <p className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5 capitalize pt-1">
                <Radio size={12} className="text-primary animate-pulse" /> {artist.genre} • {artist.handles[0]}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 shrink-0 select-none">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`h-11 px-6 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                isFollowing 
                  ? "bg-white/[0.08] border border-white/20 text-white hover:bg-white/[0.12]" 
                  : "bg-primary hover:bg-primary/90 border border-primary/20 text-black shadow-lg shadow-primary/10"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="w-11 h-11 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] rounded-full flex items-center justify-center transition-colors">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Dynamic statistics columns row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm pt-2">
          <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-left">
            <span className="text-[10px] uppercase font-black text-neutral-500 tracking-wider">Listeners</span>
            <span className="text-base font-bold text-white block mt-1.5 tabular-nums leading-none">{artist.listeners}</span>
          </div>
          <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-left">
            <span className="text-[10px] uppercase font-black text-neutral-500 tracking-wider">Followers</span>
            <span className="text-base font-bold text-white block mt-1.5 tabular-nums leading-none">{artist.followers}</span>
          </div>
          <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-left">
            <span className="text-[10px] uppercase font-black text-neutral-500 tracking-wider">Tracks</span>
            <span className="text-base font-bold text-white block mt-1.5 tabular-nums leading-none">{artistTracks.length}</span>
          </div>
        </div>

        {/* Grid split: Bio + Playlist Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-stretch">
          {/* Bio Column (5/12) */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Biography</h3>
              <p className="text-[13px] font-medium text-neutral-400 leading-relaxed">
                {artist.bio}
              </p>
            </div>
            
            <div className="h-px bg-white/5 my-2" />

            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Official Handles</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">
                  <Globe size={13} /> <a href={`https://${artist.handles[1]}`} target="_blank" rel="noreferrer" className="underline">{artist.handles[1]}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Track player card Column (7/12) */}
          <div className="lg:col-span-7 bg-[#121316] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#7CFF00] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Spotlight Selection
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Popularity Core</span>
            </div>

            {libraryTracks.length > 0 ? (
              <div className="flex flex-col sm:flex-row gap-5 items-center justify-between bg-white/[0.01] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 text-left">
                  <img src={libraryTracks[0].image} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{libraryTracks[0].title}</h4>
                    <p className="text-xs text-neutral-400 font-semibold mt-1">{libraryTracks[0].artist}</p>
                    <span className="px-2 py-0.5 bg-[#7CFF00]/10 border border-[#7CFF00]/20 rounded text-[9px] font-black text-primary uppercase mt-2.5 inline-block leading-none">
                      {libraryTracks[0].bpm} BPM · {libraryTracks[0].keySig}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handlePlayArtistPopular}
                  className="h-12 w-12 rounded-full bg-white text-black hover:bg-neutral-100 flex items-center justify-center shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  {isCurrentArtistPlaying && isPlaying ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" className="translate-x-[0.5px]" />
                  )}
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-neutral-500 font-semibold">No spotlight track listed.</div>
            )}

            <p className="text-[11px] font-semibold text-neutral-500 leading-relaxed mt-4 pt-4 border-t border-white/[0.04]">
              Each track is fully cleared for professional content creation, social media monetization, broadcast foley, and client work. Select a track below to preview or license.
            </p>
          </div>
        </div>

        {/* Tracks List Catalogue (Filterable) */}
        <div className="space-y-6 pt-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest">Artist Catalogue</h2>
              <p className="text-xs text-neutral-500 font-semibold mt-1 leading-none">Explore music edit versions</p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 pl-9 pr-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Tracks Listing */}
          {libraryTracks.length > 0 ? (
            <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01]">
              {/* Header Titles */}
              <div className="hidden lg:grid grid-cols-[minmax(220px,320px)_minmax(340px,1fr)_56px_minmax(0,220px)_auto] items-center gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                <span>Song / Artist</span>
                <span className="hidden lg:block text-left">Interactive Spectrogram</span>
                <span className="hidden lg:block text-right">Length</span>
                <span className="hidden 2xl:block text-left">Mood Details</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Dynamic list */}
              <div className="divide-y divide-white/[0.025]">
                {libraryTracks.map((trk) => {
                  const isTrkLiked = likedTrackIds.includes(trk.id);
                  return (
                    <TrackRow
                      key={trk.id}
                      track={trk}
                      activeTrack={activeTrack}
                      isPlaying={isPlaying}
                      isLiked={isTrkLiked}
                      onPlayToggle={() => {
                        playTrack({
                          id: trk.id,
                          title: trk.title,
                          artist: trk.artist,
                          genre: trk.genre,
                          bpm: trk.bpm,
                          keySig: trk.keySig,
                          duration: trk.duration,
                          image: trk.image,
                          audioUrl: trk.audioUrl
                        });
                      }}
                      onHeartClick={toggleLike}
                      onDownload={() => {}}
                      allTracks={libraryTracks}
                      theme="dark"
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="font-semibold text-neutral-400">No tracks match your query</p>
              <p className="text-[11px] text-neutral-600 mt-1">Try refining your search keyword or browse all catalog edits.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
