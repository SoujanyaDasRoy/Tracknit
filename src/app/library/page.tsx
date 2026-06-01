"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
} from "lucide-react";

import { UserDropdown } from "@/components/library/UserDropdown";
import { TrackRow } from "@/components/library/TrackRow";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api-client";
import { getLibraryTracks, type LibraryTrack } from "@/lib/library-r2";
import { usePlayerStore } from "@/store/usePlayerStore";

const FALLBACK_MUSIC: LibraryTrack[] = [
  { id: "wonderment", kind: "music", title: "Wonderment", artist: "Shimmer", genre: ["Cinematic"], bpm: 112, keySig: "D Maj", duration: "3:44", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", moods: ["Hopeful", "Inspiring"], featured: true },
  { id: "studied-abroad", kind: "music", title: "Studied Abroad", artist: "Neon Beach", genre: ["Pop"], bpm: 104, keySig: "G Maj", duration: "2:18", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", moods: ["Fun", "Happy"] },
  { id: "changing", kind: "music", title: "Changing", artist: "Mangrove", genre: ["Indie"], bpm: 89, keySig: "A Min", duration: "3:08", image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", moods: ["Hopeful", "Inspiring"], featured: true },
  { id: "reverie", kind: "music", title: "Reverie", artist: "Cody Martin", genre: ["Ambient"], bpm: 72, keySig: "C Maj", duration: "4:22", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", moods: ["Hopeful", "Inspiring"] },
  { id: "silent-world", kind: "music", title: "Silent World", artist: "Moments", genre: ["Piano"], bpm: 65, keySig: "F Maj", duration: "2:55", image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", moods: ["Romantic", "Calm"], featured: true },
  { id: "return-home", kind: "music", title: "The Return Home", artist: "Shimmer", genre: ["Folk"], bpm: 94, keySig: "E Min", duration: "3:53", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", moods: ["Happy", "Hopeful"] },
  { id: "something-save", kind: "music", title: "Something To Save", artist: "Adrian Walther", genre: ["Soul"], bpm: 82, keySig: "B Min", duration: "4:00", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", moods: ["Reflective", "Calm"] },
  { id: "done-deal", kind: "music", title: "Done Deal", artist: "Nu Alkemi$t", genre: ["Hip Hop"], bpm: 118, keySig: "C Min", duration: "3:51", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", moods: ["Fun", "Quirky"], featured: true },
  { id: "claridad", kind: "music", title: "Claridad", artist: "Matt Wigton", genre: ["Latin"], bpm: 101, keySig: "D Min", duration: "3:14", image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", moods: ["Happy", "Fun"] },
  { id: "prismatic", kind: "music", title: "Prismatic", artist: "Cody Martin", genre: ["Electronic"], bpm: 127, keySig: "G Min", duration: "3:32", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", moods: ["Hopeful", "Inspiring"] },
];

const FALLBACK_SFX: LibraryTrack[] = [
  { id: "sfx-walking-down-street", kind: "sfx", title: "Walking Down The Street 02", artist: "Foley Lab", genre: ["Footsteps"], bpm: "-", keySig: "-", duration: "0:12", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", moods: ["Urban"] },
  { id: "sfx-glitch-01", kind: "sfx", title: "Glitch 01", artist: "Design Tools", genre: ["Electronics"], bpm: "-", keySig: "-", duration: "0:02", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", moods: ["Digital"] },
  { id: "sfx-primo-pad", kind: "sfx", title: "Primo Pad 02", artist: "Atmos", genre: ["Drones"], bpm: "-", keySig: "-", duration: "0:18", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", moods: ["Ambient"] },
  { id: "sfx-tape-rewind", kind: "sfx", title: "Tape_Rewind 02", artist: "Retro Foley", genre: ["Transitions"], bpm: "-", keySig: "-", duration: "0:04", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", moods: ["Vintage"] },
  { id: "sfx-applause-short", kind: "sfx", title: "Applause Short", artist: "Crowds", genre: ["Human"], bpm: "-", keySig: "-", duration: "0:08", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", moods: ["Live"] },
  { id: "sfx-campfire-loop", kind: "sfx", title: "Campfire Small Loop", artist: "Nature", genre: ["Ambience"], bpm: "-", keySig: "-", duration: "0:30", image: "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", moods: ["Warm"] },
  { id: "sfx-rumble-distant", kind: "sfx", title: "Rumble Distant 02", artist: "Impact Lab", genre: ["Impacts"], bpm: "-", keySig: "-", duration: "0:07", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", moods: ["Cinematic"] },
  { id: "sfx-drive-by", kind: "sfx", title: "Drive By Medium Speed Nature 01", artist: "Vehicles", genre: ["Transportation"], bpm: "-", keySig: "-", duration: "0:10", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", moods: ["Motion"] },
];

const moodCards = [
  { title: "Cinematic", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&q=80" },
  { title: "Emotional", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=700&q=80" },
  { title: "Corporate", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700&q=80" },
  { title: "Epic", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80" },
  { title: "Chill", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80" },
  { title: "Energetic", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700&q=80" },
];

const featuredPlaylists = [
  { title: "Creator Picks", count: "48 tracks", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80" },
  { title: "Trending on YouTube", count: "36 tracks", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
  { title: "Documentary Scores", count: "52 tracks", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80" },
  { title: "Podcast Essentials", count: "31 tracks", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80" },
  { title: "Wedding Collection", count: "44 tracks", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500&q=80" },
  { title: "Cinematic Trailers", count: "57 tracks", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=80" },
  { title: "Corporate Beats", count: "29 tracks", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80" },
  { title: "Lo-Fi Study Session", count: "62 tracks", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&q=80" },
  { title: "Synthwave Retro", count: "40 tracks", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
  { title: "Acoustic Journey", count: "35 tracks", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80" },
  { title: "Epic Orchestral", count: "50 tracks", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80" },
  { title: "Ambient Relaxation", count: "45 tracks", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&q=80" },
];

function SectionTitle({ title, href, label = "View All" }: { title: string; href?: string; label?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/32">Tracknit catalog</p>
        <h2 className="text-[19px] font-semibold tracking-tight text-[#F0F5ED]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/58 transition-colors hover:border-[#7CFF00]/40 hover:text-[#7CFF00]">
          {label} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

export default function LibraryOverviewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [musicTracks, setMusicTracks] = useState<LibraryTrack[]>(FALLBACK_MUSIC);
  const [sfxTracks, setSfxTracks] = useState<LibraryTrack[]>(FALLBACK_SFX);
  const [loading, setLoading] = useState(true);

  const playlistScrollRef = useRef<HTMLDivElement>(null);
  const scrollPlaylists = useCallback((direction: "left" | "right") => {
    const container = playlistScrollRef.current;
    if (!container) return;
    const scrollAmount = 480;
    container.scrollTo({
      left: container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth"
    });
  }, []);

  const {
    activeTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    toggleLike,
    fetchFavorites,
  } = usePlayerStore();

  const isLoggedIn = !!session?.user;
  const planTier = (session?.user as any)?.planTier as string | undefined;
  const isPlanActive = !!planTier && planTier !== "free";

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  useEffect(() => {
    if (session?.user) fetchFavorites();
  }, [session, fetchFavorites]);

  useEffect(() => {
    async function loadLibraryData() {
      try {
        const response = await apiFetch("/tracks?kind=music");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) setMusicTracks(data);
        else {
          const manifest = await getLibraryTracks("music");
          if (manifest.length > 0) setMusicTracks(manifest);
        }
      } catch (err) {
        try {
          const manifest = await getLibraryTracks("music");
          if (manifest.length > 0) setMusicTracks(manifest);
        } catch {
          console.warn("Using fallback music tracks:", err);
        }
      }

      try {
        const response = await apiFetch("/tracks?kind=sfx");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) setSfxTracks(data);
        else {
          const manifest = await getLibraryTracks("sfx");
          if (manifest.length > 0) setSfxTracks(manifest);
        }
      } catch (err) {
        try {
          const manifest = await getLibraryTracks("sfx");
          if (manifest.length > 0) setSfxTracks(manifest);
        } catch {
          console.warn("Using fallback SFX tracks:", err);
        }
      }

      setLoading(false);
    }

    loadLibraryData();
  }, []);

  const popularMusic = useMemo(() => {
    const featured = musicTracks.filter((track) => track.image).slice(0, 10);
    return featured.length >= 8 ? featured : FALLBACK_MUSIC;
  }, [musicTracks]);

  const recentMusic = useMemo(() => {
    const source = musicTracks.filter((track) => track.image);
    return (source.length >= 8 ? source : FALLBACK_MUSIC).slice(-8).reverse();
  }, [musicTracks]);

  const featuredSfx = useMemo(() => {
    const source = sfxTracks.filter((track) => track.title);
    return (source.length >= 8 ? source : FALLBACK_SFX).slice(0, 8);
  }, [sfxTracks]);

  const handlePlayToggle = useCallback((track: LibraryTrack) => {
    if (activeTrack?.id === track.id) {
      togglePlay();
      return;
    }

    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      bpm: track.bpm,
      keySig: track.keySig,
      duration: track.duration,
      image: track.image,
      audioUrl: track.audioUrl,
      waveform: track.waveform,
    });
  }, [activeTrack, playTrack, togglePlay]);

  const handleHeartClick = useCallback(async (trackId: string) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      await toggleLike(trackId);
    } catch {
      alert("Failed to update favorite. Please try again.");
    }
  }, [router, session, toggleLike]);



  return (
    <div className="min-h-screen bg-[#080808] text-[#F0F5ED] font-sans">
      <header className="sticky top-0 z-50 h-[64px] border-b border-white/[0.07] bg-[#181818]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1680px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 mr-2">
              <img src="/logo.svg" alt="Tracknit" className="h-[36px] w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-white transition-colors">
                Discover
              </Link>
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                Music <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                Sound Effects <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
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
                <Link
                  href="/login"
                  className="h-9 px-5 bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest font-body font-medium rounded-full flex items-center justify-center transition-colors"
                >
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
                <Link href="/pricing" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">
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
                <Link href="/library/liked" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">
                  My Library
                </Link>
              </>
            )}

            {isLoggedIn && <UserDropdown planTier={planTier} />}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1560px] px-6 pb-24 lg:px-10 space-y-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_28%_8%,rgba(124,255,0,0.065),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_62%)]" />

        <section className="relative mt-6 grid min-h-[520px] grid-cols-1 items-center gap-8 md:gap-12 lg:gap-16 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#1A1A1A] p-6 shadow-2xl shadow-black/45 md:grid-cols-2 lg:p-8 xl:p-14">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1800&auto=format&fit=crop"
              alt="Neon mixing console board"
              className="h-full w-full object-cover object-center saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/96 to-[#1A1A1A]/80" />
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#f3ff4f]/[0.035] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#7CFF00]/[0.025] blur-[100px] rounded-full pointer-events-none" />
          </div>

          <div className="relative z-10 flex max-w-[700px] flex-col justify-center">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#7CFF00]" />
              <p className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#7CFF00]">
                100% human-made music
              </p>
            </div>
            <h1 className="font-sans text-[36px] md:text-[46px] lg:text-[54px] font-black leading-[1.1] tracking-tight text-white">
              Premium royalty free music, crafted by <span className="text-[#7CFF00] font-normal tracking-wide inline-block" style={{ fontFamily: "'Alex Brush', cursive", fontSize: "1.25em" }}>real artists</span>
            </h1>
            <p className="mt-4 max-w-[530px] text-[15px] md:text-[16px] leading-[1.7] text-white/70">
              Every track in our catalog is written, performed, and recorded by real musicians. No AI-generated audio, no shortcuts.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              <Link
                href="/library/royalty-free-music"
                className="bg-[#7CFF00] text-black px-8 py-3.5 rounded-full font-bold text-[12.5px] uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_rgba(124,255,0,0.2)] flex items-center justify-center"
              >
                Browse Music
              </Link>
              <Link
                href="/pricing"
                className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-[12.5px] uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center"
              >
                View Plans
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden items-center justify-end md:flex w-full">
            <div className="group relative w-full max-w-[440px] lg:max-w-[500px] xl:max-w-[580px] aspect-[1.45] overflow-hidden rounded-[24px] border border-white/[0.18] bg-[#121417] shadow-[0_0_50px_rgba(124,255,0,0.14)] shadow-black/60 transition-all duration-500 hover:scale-[1.015] hover:border-[#7CFF00]/40">
              <div className="h-full w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200&auto=format&fit=crop"
                  alt="Backlit studio synthesizer keys close up under warm lights"
                  className="h-full w-full object-cover saturate-[1.25] brightness-[1.05] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <SectionTitle title="Browse by Mood" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {moodCards.map((item) => (
              <Link key={item.title} href="/library/royalty-free-music" className="group">
                <div className="relative aspect-[1.08] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#121417] shadow-xl shadow-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#7CFF00]/25">
                  <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-72 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/22 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/32">Tracknit catalog</p>
              <h2 className="text-[19px] font-semibold tracking-tight text-[#F0F5ED]">Featured Playlists</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => scrollPlaylists("left")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollPlaylists("right")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <Link href="/library/collections" className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/58 transition-colors hover:border-[#7CFF00]/40 hover:text-[#7CFF00]">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div
            ref={playlistScrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {featuredPlaylists.map((item) => (
              <Link key={item.title} href="/library/collections" className="group w-[168px] shrink-0">
                <div className="relative aspect-square overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#121417] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#7CFF00]/25">
                  <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/28 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7CFF00] text-black">
                      <Play className="h-4 w-4 fill-black translate-x-[1px]" />
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 truncate text-[14px] font-medium text-white">{item.title}</h3>
                <p className="mt-1 text-[12px] font-medium text-white/42">{item.count}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative">
          <SectionTitle title="Trending Tracks" />
          <div className="overflow-visible bg-transparent">
            {(loading ? FALLBACK_MUSIC : popularMusic).map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                isLiked={likedTrackIds.includes(track.id)}
                onPlayToggle={handlePlayToggle}
                onHeartClick={handleHeartClick}
                onDownload={handleDownload}
                allTracks={musicTracks}
              />
            ))}
          </div>
          <div className="mt-5 flex justify-center">
            <Link href="/library/royalty-free-music" className="rounded-full border border-white/14 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/70 transition-colors hover:border-[#7CFF00]/35 hover:text-[#7CFF00]">View More Tracks</Link>
          </div>
        </section>

        <section className="relative">
          <SectionTitle title="Recently Added" href="/library/royalty-free-music" label="View All New" />
          <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentMusic.map((track) => (
              <button key={track.id} type="button" onClick={() => handlePlayToggle(track)} className="group w-[160px] shrink-0 text-left">
                <div className="relative aspect-square overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#121417] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#7CFF00]/25">
                  <img src={track.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/28 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7CFF00] text-black">
                      <Play className="h-4 w-4 fill-black translate-x-[1px]" />
                    </span>
                  </div>
                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white/72 backdrop-blur">New</span>
                </div>
                <h3 className="mt-3 truncate text-[14px] font-medium text-white">{track.title}</h3>
                <p className="mt-1 truncate text-[12px] font-medium text-white/42">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="relative">
          <SectionTitle title="Featured Sound Effects" href="/library/sound-effects" label="View All" />
          <div className="overflow-visible bg-transparent">
            {featuredSfx.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                isLiked={likedTrackIds.includes(track.id)}
                onPlayToggle={handlePlayToggle}
                onHeartClick={handleHeartClick}
                onDownload={handleDownload}
                allTracks={sfxTracks}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
