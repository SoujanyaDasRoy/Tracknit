"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Shuffle, SkipBack, SkipForward, Repeat, 
  Volume, Volume1, Volume2, VolumeX, Heart, Download, X, 
  ShoppingCart, Plus, Minimize2, Maximize2, MoreHorizontal,
  Check, Info, Sparkles, ChevronDown, ShieldCheck, HelpCircle, 
  AlertCircle, ArrowRight
} from "lucide-react";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useCartStore } from "@/store/useCartStore";
import { apiFetch } from "@/lib/api-client";
import { getTrackWaveform, WAVEFORM_BAR_COUNT } from "@/lib/waveform";
import Link from "next/link";

interface MockTrack {
  id: string;
  kind: string;
  title: string;
  artist: string;
  genre: string[];
  bpm: number;
  keySig: string;
  duration: string;
  moods: string[];
  explicit: boolean;
  vocals: boolean;
  instruments: string[];
  image: string;
  audioUrl?: string;
  waveform?: number[];
}

// Hardcoded library sequence to enable dynamic queue calculation, recommendations, and drawer panels
const ALL_LIBRARY_TRACKS: MockTrack[] = [
  { id: "mission", kind: "music", title: "Mission", artist: "Nevin", genre: ["Post-Punk Revival"], bpm: 171, keySig: "D Min", duration: "3:34", moods: ["Angry", "Dark"], explicit: true, vocals: true, instruments: ["Electric Guitar", "Drums", "Bass", "Synth"], image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "civilize", kind: "music", title: "Civilize", artist: "West & Zander", genre: ["Nu Disco", "Deep House"], bpm: 115, keySig: "G Maj", duration: "3:09", moods: ["Laid Back", "Smooth"], explicit: false, vocals: false, instruments: ["Rhodes Piano", "Synth Bass", "Drums"], image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "where-wind", kind: "music", title: "Where the Wind...", artist: "Mizlo", genre: ["Funk", "Alternative"], bpm: 95, keySig: "F Min", duration: "2:06", moods: ["Happy", "Laid Back"], explicit: false, vocals: false, instruments: ["Clavinet", "Slap Bass", "Brass", "Drums"], image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "ructor-bounce", kind: "music", title: "ructor Bounce Ins", artist: "Marcus Price", genre: ["Footwork"], bpm: 160, keySig: "A Min", duration: "2:54", moods: ["Happy", "Restless"], explicit: false, vocals: false, instruments: ["808 Bass", "Snares", "Synth Leads"], image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: "you-are", kind: "music", title: "u Are Whoever", artist: "Cezar", genre: ["Reggae", "Caribbean"], bpm: 80, keySig: "C Maj", duration: "3:04", moods: ["Hopeful", "Laid Back"], explicit: false, vocals: true, instruments: ["Hammond Organ", "Bass", "Reggae Guitars"], image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: "old-shadow", kind: "music", title: "old Shadow +", artist: "Torii Wolf", genre: ["Alternative Pop"], bpm: 170, keySig: "D Min", duration: "3:13", moods: ["Dreamy", "Mysterious"], explicit: false, vocals: true, instruments: ["Pads", "Sub Bass", "Vocal Choppers"], image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: "sun-and-moon", kind: "music", title: "The Sun and th...", artist: "Mukryan Molod", genre: ["Orchestral Hybrid"], bpm: 95, keySig: "Eb Maj", duration: "3:24", moods: ["Epic", "Hopeful"], explicit: false, vocals: false, instruments: ["Strings", "French Horns", "Timpani", "Choir"], image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: "itll-pass", kind: "music", title: "It'll All Pass", artist: "Torii Wolf", genre: ["Indie Folk"], bpm: 95, keySig: "E Min", duration: "4:27", moods: ["Calm"], explicit: false, vocals: true, instruments: ["Acoustic Guitar", "Cello", "Vocals"], image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
];

// DAW Timeline Section Markers
const SECTIONS = [
  { name: "Intro", start: 0.0, end: 0.15 },
  { name: "Build", start: 0.15, end: 0.35 },
  { name: "Chorus", start: 0.35, end: 0.60 },
  { name: "Drop", start: 0.60, end: 0.80 },
  { name: "Outro", start: 0.80, end: 1.0 }
];

// Bypasses local / empty / invalid preview urls with stable SoundHelix demo mp3s
const getValidAudioUrl = (url?: string, trackId?: string) => {
  if (!url || url.includes("localhost") || url.includes("example.com") || url.includes("previews/music") || url.includes("previews/sfx") || url.trim() === "") {
    const seed = trackId || "1";
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
    const index = (Math.abs(h) % 8) + 1;
    return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index}.mp3`;
  }
  return url;
};

export default function AudioPlayer() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasSidebar = pathname ? pathname.startsWith("/library/") : false;
  
  const { 
    activeTrack, 
    isPlaying, 
    isPlayerVisible, 
    togglePlay, 
    closePlayer, 
    setIsPlaying, 
    likedTrackIds, 
    toggleLike 
  } = usePlayerStore();
  
  const soundRef = useRef<Howl | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [downloading, setDownloading] = useState(false);
  const requestRef = useRef<number | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef<HTMLDivElement | null>(null);
  const shuffleRef = useRef(false);
  const repeatModeRef = useRef<"off" | "all" | "one">("off");
  
  // Interactive gesture dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Hover Seek Preview states
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [isHoveringWaveform, setIsHoveringWaveform] = useState(false);

  // Creative licensing workstation overlays & state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showSimilarDrawer, setShowSimilarDrawer] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Full Version");
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  // Stems Mixer States
  const [vocalsVol, setVocalsVol] = useState(100);
  const [drumsVol, setDrumsVol] = useState(100);
  const [bassVol, setBassVol] = useState(100);
  const [melodiesVol, setMelodiesVol] = useState(100);
  
  const [mutedStems, setMutedStems] = useState<string[]>([]);
  const [soloedStems, setSoloedStems] = useState<string[]>([]);

  const [vocalsMeter, setVocalsMeter] = useState(0);
  const [drumsMeter, setDrumsMeter] = useState(0);
  const [bassMeter, setBassMeter] = useState(0);
  const [melodiesMeter, setMelodiesMeter] = useState(0);

  const isLiked = activeTrack ? likedTrackIds.includes(activeTrack.id) : false;

  useEffect(() => {
    shuffleRef.current = shuffleEnabled;
  }, [shuffleEnabled]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  // Dynamic Stems Meter Animation Effect
  useEffect(() => {
    let animId: number;
    const updateMeters = () => {
      if (isPlaying) {
        const time = Date.now() * 0.004;
        
        const isVActive = !mutedStems.includes("vocals") && (soloedStems.length === 0 || soloedStems.includes("vocals"));
        const isDActive = !mutedStems.includes("drums") && (soloedStems.length === 0 || soloedStems.includes("drums"));
        const isBActive = !mutedStems.includes("bass") && (soloedStems.length === 0 || soloedStems.includes("bass"));
        const isMActive = !mutedStems.includes("melodies") && (soloedStems.length === 0 || soloedStems.includes("melodies"));

        const vVol = isVActive ? vocalsVol / 100 : 0;
        const dVol = isDActive ? drumsVol / 100 : 0;
        const bVol = isBActive ? bassVol / 100 : 0;
        const mVol = isMActive ? melodiesVol / 100 : 0;

        setVocalsMeter((Math.sin(time) * 0.25 + 0.75) * 100 * vVol * (0.85 + Math.random() * 0.15));
        setDrumsMeter((Math.cos(time * 1.3) * 0.35 + 0.65) * 100 * dVol * (0.8 + Math.random() * 0.2));
        setBassMeter((Math.sin(time * 0.7) * 0.3 + 0.7) * 100 * bVol * (0.9 + Math.random() * 0.1));
        setMelodiesMeter((Math.cos(time * 0.95) * 0.2 + 0.8) * 100 * mVol * (0.85 + Math.random() * 0.15));
      } else {
        setVocalsMeter(0);
        setDrumsMeter(0);
        setBassMeter(0);
        setMelodiesMeter(0);
      }
      animId = requestAnimationFrame(updateMeters);
    };

    updateMeters();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, vocalsVol, drumsVol, bassVol, melodiesVol, mutedStems, soloedStems]);

  const stopProgressLoop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  const startProgressLoop = useCallback(() => {
    const tick = () => {
      if (soundRef.current && soundRef.current.playing()) {
        const currentProgress = (soundRef.current.seek() as number) || 0;
        setProgress(currentProgress);
        usePlayerStore.getState().setProgress(currentProgress);
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    tick();
  }, []);

  // Seek handler based on cursor position relative to the waveform bounding box
  const handleSeekToX = useCallback((clientX: number) => {
    const activeDuration = getActiveDuration();
    if (!waveformRef.current || !soundRef.current || activeDuration <= 0) return;
    const bounds = waveformRef.current.getBoundingClientRect();
    const x = clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    const newTime = percentage * activeDuration;
    
    soundRef.current.seek(newTime);
    setProgress(newTime);
  }, [duration, selectedVersion, activeTrack]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only trigger dragging on main/left click
    setIsDragging(true);
    handleSeekToX(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleSeekToX(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleSeekToX]);

  // Volume slider scrubbing logic
  const handleVolumeToX = useCallback((clientX: number) => {
    if (!volumeRef.current) return;
    const bounds = volumeRef.current.getBoundingClientRect();
    const x = clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    setVolume(percentage);
  }, []);

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsDraggingVolume(true);
    handleVolumeToX(e.clientX);
  };

  useEffect(() => {
    if (!isDraggingVolume) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleVolumeToX(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingVolume, handleVolumeToX]);

  // Waveform hovering/scrubbing coordinate checks
  const handleMouseMoveWaveform = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const activeDuration = getActiveDuration();
    if (!waveformRef.current || activeDuration <= 0) return;
    const bounds = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    setHoverPercent(percentage);
    
    // Track which waveform bar is currently under the cursor
    const idx = Math.floor(percentage * WAVEFORM_BAR_COUNT);
    setHoverIndex(idx);
  }, [duration]);

  const handleMouseLeaveWaveform = () => {
    setIsHoveringWaveform(false);
    setHoverIndex(null);
    setHoverPercent(null);
  };

  const handleMouseEnterWaveform = () => {
    setIsHoveringWaveform(true);
  };

  // Initialize and handle track changes
  useEffect(() => {
    if (!activeTrack) return;

    // Reset layout version selectors
    setSelectedVersion("Full Version");

    // Cleanup previous sound
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const soundSrc = getValidAudioUrl(activeTrack.audioUrl, activeTrack.id);
    if (!soundSrc) {
      setIsPlaying(false);
      return;
    }

    const sound = new Howl({
      src: [soundSrc],
      html5: true,
      volume: volume,
      rate: speed,
      onplay: () => {
        setIsPlaying(true);
        const dur = sound.duration();
        setDuration(dur);
        usePlayerStore.getState().setDuration(dur);
        startProgressLoop();
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressLoop();
      },
      onend: () => {
        const repeatSetting = repeatModeRef.current;
        if (repeatSetting === "one") {
          sound.seek(0);
          sound.play();
          setProgress(0);
          usePlayerStore.getState().setProgress(0);
          return;
        }

        if (repeatSetting === "all" || shuffleRef.current) {
          const currentIdx = ALL_LIBRARY_TRACKS.findIndex(
            (t) => t.id === activeTrack.id || t.title.toLowerCase() === activeTrack.title.toLowerCase()
          );
          const nextIdx = shuffleRef.current
            ? Math.floor(Math.random() * ALL_LIBRARY_TRACKS.length)
            : (currentIdx + 1) % ALL_LIBRARY_TRACKS.length;
          usePlayerStore.getState().playTrack(ALL_LIBRARY_TRACKS[nextIdx]);
          return;
        }

        setIsPlaying(false);
        setProgress(0);
        usePlayerStore.getState().setProgress(0);
        stopProgressLoop();
      },
      onload: () => {
        const dur = sound.duration();
        setDuration(dur);
        usePlayerStore.getState().setDuration(dur);
      },
      onloaderror: () => {
        setIsPlaying(false);
        setProgress(0);
        usePlayerStore.getState().setProgress(0);
        setDuration(0);
        usePlayerStore.getState().setDuration(0);
      },
      onplayerror: () => {
        setIsPlaying(false);
      }
    });

    soundRef.current = sound;

    if (isPlaying) {
      sound.play();
    }

    return () => {
      sound.unload();
      stopProgressLoop();
    };
  }, [activeTrack]);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const setSeekTo = usePlayerStore((state) => state.setSeekTo);

  // Handle seek requests from store
  useEffect(() => {
    if (seekTo !== null && soundRef.current) {
      soundRef.current.seek(seekTo);
      setProgress(seekTo);
      usePlayerStore.getState().setProgress(seekTo);
      setSeekTo(null);
    }
  }, [seekTo, setSeekTo]);

  // Handle play/pause toggles from UI
  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying && !soundRef.current.playing()) {
        soundRef.current.play();
      } else if (!isPlaying && soundRef.current.playing()) {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Handle rate/speed changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.rate(speed);
    }
  }, [speed]);

  const getParsedTrackDuration = () => {
    if (!activeTrack || !activeTrack.duration) return 200;
    const parts = activeTrack.duration.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 200;
  };

  // Handles bounding progress bounds depending on selected edit version
  const getActiveDuration = () => {
    const trackDur = getParsedTrackDuration();
    const currentDur = duration || trackDur;
    if (selectedVersion === "30 Second") return Math.min(30, duration || 30);
    if (selectedVersion === "15 Second") return Math.min(15, duration || 15);
    if (selectedVersion === "60 Second") return Math.min(60, duration || 60);
    return duration || 214; // fallback
  };

  // Auto-stop track if it reaches selected version bounds
  useEffect(() => {
    const activeLimit = getActiveDuration();
    if (progress >= activeLimit && isPlaying && soundRef.current) {
      soundRef.current.pause();
      soundRef.current.seek(0);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [progress, selectedVersion, duration, isPlaying]);

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, x / bounds.width));
    setVolume(percentage);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleHeartClick = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (activeTrack) {
      try {
        await toggleLike(activeTrack.id);
      } catch (err) {
        alert("Failed to update favorite. Please try again.");
      }
    }
  };

  // Dynamic queue search & matching recommendation sequence calculations
  const getQueueInfo = () => {
    if (!activeTrack) return { index: 1, total: 8, nextTitle: "Night Runner" };
    const currentTrackIndex = ALL_LIBRARY_TRACKS.findIndex(
      (t) => t.id === activeTrack.id || t.title.toLowerCase() === activeTrack.title.toLowerCase()
    );
    const queueIndex = currentTrackIndex !== -1 ? currentTrackIndex + 1 : 1;
    const totalQueueCount = ALL_LIBRARY_TRACKS.length;
    const nextTrack = ALL_LIBRARY_TRACKS[(queueIndex) % totalQueueCount];
    return {
      index: queueIndex,
      total: totalQueueCount,
      nextTitle: nextTrack ? nextTrack.title : "Night Runner"
    };
  };

  const getSimilarTracks = () => {
    if (!activeTrack) return [];
    // Slice fallback recommendations
    return ALL_LIBRARY_TRACKS.filter(
      (t) => t.id !== activeTrack.id && t.title.toLowerCase() !== activeTrack.title.toLowerCase()
    ).slice(0, 3);
  };

  const getActiveTrackDetails = () => {
    const staticDetails = {
      bpm: 120,
      keySig: "C Maj",
      moods: ["Epic", "Hopeful"],
      genre: "Orchestral",
      instruments: ["Strings", "Piano", "Synthesizer", "Percussion"],
      energy: "High",
      usage: "YouTube Safe, Unlimited Podcast & Video Broadcast Monetization"
    };
    if (!activeTrack) return staticDetails;
    const matched = ALL_LIBRARY_TRACKS.find(
      (t) => t.id === activeTrack.id || t.title.toLowerCase() === activeTrack.title.toLowerCase()
    );
    if (!matched) return staticDetails;
    return {
      bpm: matched.bpm,
      keySig: matched.keySig,
      moods: matched.moods,
      genre: matched.genre[0],
      instruments: matched.instruments || staticDetails.instruments,
      energy: matched.bpm > 130 ? "Very High" : matched.bpm > 100 ? "Medium-High" : "Chill",
      usage: matched.kind === "sfx" ? "Foley, Game Design, & Video Soundscapes Safe" : staticDetails.usage
    };
  };

  // Triggers MP3/WAV/STEMS modal packaging animations
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
            setShowDownloadModal(false);
            // Initiate core high quality R2 file download trigger
            handleDownloadClick();
          }, 650);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDownloadClick = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!activeTrack) return;

    setDownloading(true);
    try {
      const response = await apiFetch(`/tracks/${activeTrack.id}/download`, {
        method: "POST"
      });
      const data = await response.json();
      
      if (data.download_url) {
        const audioLink = document.createElement("a");
        audioLink.href = data.download_url;
        audioLink.setAttribute("download", `${activeTrack.title} - ${activeTrack.artist}.wav`);
        document.body.appendChild(audioLink);
        audioLink.click();
        document.body.removeChild(audioLink);
      }

      if (data.license_url) {
        setTimeout(() => {
          const licenseLink = document.createElement("a");
          licenseLink.href = data.license_url;
          licenseLink.setAttribute("target", "_blank");
          licenseLink.setAttribute("download", `License - ${activeTrack.title}.pdf`);
          document.body.appendChild(licenseLink);
          licenseLink.click();
          document.body.removeChild(licenseLink);
        }, 800);
      }

    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to download track. Check subscription status.");
    } finally {
      setDownloading(false);
    }
  };

  // Select dynamic Lucide speaker status indicator dynamic sizing
  const renderVolumeIcon = () => {
    const iconSize = 16;
    const iconClass = "transition-colors duration-200 text-neutral-300 hover:text-white shrink-0 cursor-pointer";
    if (volume === 0) {
      return <VolumeX size={iconSize} className="text-neutral-600 shrink-0 cursor-pointer" />;
    } else if (volume < 0.3) {
      return <Volume size={iconSize} className={iconClass} />;
    } else if (volume < 0.7) {
      return <Volume1 size={iconSize} className={iconClass} />;
    } else {
      return <Volume2 size={iconSize} className={iconClass} />;
    }
  };

  const activeWaves = useMemo(() => activeTrack ? getTrackWaveform(activeTrack) : [], [activeTrack]);

  if (!activeTrack || pathname === "/") return null;

  const queueInfo = getQueueInfo();
  const similarTracks = getSimilarTracks();
  const meta = getActiveTrackDetails();
  const activeDuration = getActiveDuration();
  const closePlayerSurface = () => {
    setShowActionMenu(false);
    setIsExpanded(false);
    closePlayer();
  };

  return (
    <AnimatePresence>
      {isPlayerVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className={`fixed bottom-4 left-4 ${hasSidebar ? "lg:left-[276px]" : ""} right-4 z-[100] pointer-events-none`}
        >
          {/* Conversion Promo Banner above player */}
          {showPromoBanner && (
            <div className="w-full bg-[#181A1C] border-t border-white/[0.05] border-b border-black/25 px-8 py-3.5 flex items-center justify-between text-left pointer-events-auto relative z-10 select-none">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[13.5px] font-bold text-white tracking-tight">Love this track?</h4>
                <p className="text-[11.5px] text-neutral-400 font-semibold leading-none">Grab a license or subscribe for unlimited licensing</p>
              </div>
              <div className="flex items-center gap-3 pr-8 relative">
                <button 
                  onClick={() => setShowDownloadModal(true)}
                  className="h-8.5 px-4 bg-transparent border border-white/20 hover:border-white/40 text-white text-[12px] font-semibold tracking-wider rounded transition-all cursor-pointer" 
                  title="Add to Cart"
                >
                  Add to Cart
                </button>
                <Link
                  href="/pricing"
                  className="h-8.5 px-4 bg-white hover:bg-neutral-100 text-black text-[12px] font-semibold tracking-wider rounded flex items-center justify-center transition-all cursor-pointer" 
                  title="Become a Member"
                >
                  Become a Member
                </Link>
                {/* Close Button */}
                <button 
                  onClick={() => setShowPromoBanner(false)}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer p-1"
                  title="Close banner"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Collapsed State Player */}
          <div className="hidden md:grid w-full grid-cols-[280px_300px_minmax(340px,1fr)_auto] items-center gap-6 overflow-visible rounded-2xl border border-white/[0.12] bg-[#111317]/95 px-7 h-[84px] pointer-events-auto relative z-20 select-none text-white shadow-[0_22px_70px_rgba(0,0,0,0.72),0_0_0_1px_rgba(124,255,0,0.06)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            <div className="flex min-w-0 items-center gap-3 text-left">
              <button
                onClick={() => setIsExpanded(true)}
                className="h-14 w-14 shrink-0 overflow-hidden rounded-[6px] bg-neutral-900 shadow-[0_12px_28px_rgba(0,0,0,0.45)] cursor-pointer"
                title="Open player workspace"
              >
                {activeTrack.image ? (
                  <img src={activeTrack.image} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" alt="" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[9px] font-black text-white/30">
                    {activeTrack.id.startsWith("s") ? "SFX" : "TRK"}
                  </span>
                )}
              </button>

              <div className="min-w-0">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="block max-w-full truncate text-left text-[15px] font-semibold leading-tight tracking-normal text-white transition-colors hover:text-white/85 cursor-pointer"
                >
                  {activeTrack.title}
                </button>
                <span className="mt-1.5 block truncate text-[12.5px] font-medium leading-tight tracking-normal text-white/64">
                  {activeTrack.artist}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 text-white">
              <div className="flex items-center gap-2">
                <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-white/90 hover:text-white transition-colors cursor-pointer" title="Volume">
                  {renderVolumeIcon()}
                </button>
                <div
                  ref={volumeRef}
                  onMouseDown={handleVolumeMouseDown}
                  className="h-[3px] w-14 rounded-full bg-white/15 cursor-ew-resize"
                  title="Volume"
                >
                  <div className="h-full rounded-full bg-white" style={{ width: `${volume * 100}%` }} />
                </div>
              </div>

              <button
                onClick={() => setShuffleEnabled((current) => !current)}
                className={`transition-colors cursor-pointer ${shuffleEnabled ? "text-white" : "text-white/28 hover:text-white/70"}`}
                title={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
              >
                <Shuffle size={21} strokeWidth={2.2} />
              </button>

              <button
                onClick={() => {
                  const currentIdx = ALL_LIBRARY_TRACKS.findIndex(t => t.id === activeTrack.id || t.title.toLowerCase() === activeTrack.title.toLowerCase());
                  const prevIdx = (currentIdx - 1 + ALL_LIBRARY_TRACKS.length) % ALL_LIBRARY_TRACKS.length;
                  usePlayerStore.getState().playTrack(ALL_LIBRARY_TRACKS[prevIdx]);
                }}
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
                title="Previous"
              >
                <SkipBack fill="currentColor" size={18} strokeWidth={1.5} />
              </button>

              <button onClick={togglePlay} className="flex h-10 w-10 items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer" title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={30} className="translate-x-[2px]" />}
              </button>

              <button
                onClick={() => {
                  const currentIdx = ALL_LIBRARY_TRACKS.findIndex(t => t.id === activeTrack.id || t.title.toLowerCase() === activeTrack.title.toLowerCase());
                  const nextIdx = shuffleEnabled ? Math.floor(Math.random() * ALL_LIBRARY_TRACKS.length) : (currentIdx + 1) % ALL_LIBRARY_TRACKS.length;
                  usePlayerStore.getState().playTrack(ALL_LIBRARY_TRACKS[nextIdx]);
                }}
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
                title="Next"
              >
                <SkipForward fill="currentColor" size={18} strokeWidth={1.5} />
              </button>

              <button
                onClick={() => setRepeatMode((current) => current === "off" ? "all" : current === "all" ? "one" : "off")}
                className={`relative transition-colors cursor-pointer ${repeatMode !== "off" ? "text-white" : "text-white/28 hover:text-white/70"}`}
                title={repeatMode === "one" ? "Repeat one" : repeatMode === "all" ? "Repeat all" : "Repeat off"}
              >
                <Repeat size={20} strokeWidth={2.1} />
                {repeatMode === "one" && (
                  <span className="absolute -right-1 -top-1 text-[8px] font-black leading-none text-white">1</span>
                )}
              </button>

              <button
                onClick={() => setSpeed((current) => current >= 2 ? 0.75 : current === 0.75 ? 1 : current === 1 ? 1.25 : current === 1.25 ? 1.5 : 2)}
                className="min-w-9 rounded border border-white/12 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white/75 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
                title="Playback speed"
              >
                {speed}x
              </button>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <span className="w-10 text-right text-[13px] font-semibold tabular-nums text-white">
                {formatTime(progress)}
              </span>

              <div 
                ref={waveformRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMoveWaveform}
                onMouseEnter={handleMouseEnterWaveform}
                onMouseLeave={handleMouseLeaveWaveform}
                className="relative flex h-[48px] min-w-0 flex-1 cursor-ew-resize items-center overflow-hidden rounded-sm"
              >
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.08]" />
                <div className="relative z-10 flex h-full w-full items-center gap-[1px]">
                  {activeWaves.map((heightPercent, i) => {
                    const barPercent = (i / WAVEFORM_BAR_COUNT) * 100;
                    const progressPercent = activeDuration > 0 ? (progress / activeDuration) * 100 : 0;
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
                            ? "rgba(245,245,245,0.9)"
                            : isHoveringWaveform && distance <= 6
                            ? "rgba(255,255,255,0.28)"
                            : "rgba(255,255,255,0.13)"
                        }}
                      />
                    );
                  })}
                </div>

                {isHoveringWaveform && hoverPercent !== null && activeDuration > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center" style={{ left: `${hoverPercent * 100}%` }}>
                    <div className="h-full w-[1.5px] bg-white/35" />
                    <div className="absolute -top-4 -translate-x-1/2 rounded bg-[#16181c] px-1.5 py-0.5 text-[9px] font-medium leading-none text-white shadow-lg">
                      {formatTime(hoverPercent * activeDuration)}
                    </div>
                  </div>
                )}

                {activeDuration > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 z-20 flex flex-col items-center" style={{ left: `${(progress / activeDuration) * 100}%` }}>
                    <div className="h-full w-[1.5px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.35)]" />
                  </div>
                )}
              </div>

              <span className="w-10 text-[13px] font-semibold tabular-nums text-white/78">
                {formatTime(activeDuration)}
              </span>
            </div>

            <div className="relative flex items-center justify-end gap-2 text-white">
              <button
                onClick={() => setIsExpanded(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white cursor-pointer"
                title="Open player workspace"
              >
                <Maximize2 size={19} strokeWidth={2} />
              </button>
              <button 
                onClick={() => setShowActionMenu((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white cursor-pointer"
                title="More player actions"
              >
                <MoreHorizontal size={21} strokeWidth={2.2} />
              </button>
              <button
                onClick={closePlayerSurface}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white cursor-pointer"
                title="Close player"
              >
                <X size={20} strokeWidth={2} />
              </button>

              <AnimatePresence>
                {showActionMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute bottom-[52px] right-11 z-40 w-56 rounded-xl border border-white/10 bg-[#15171b]/98 p-1.5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl"
                  >
                    <button onClick={() => { setShowActionMenu(false); setShowDetailsDrawer(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Info size={15} /> Track details
                    </button>
                    <button onClick={() => { setShowActionMenu(false); setShowSimilarDrawer(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Sparkles size={15} /> Similar tracks
                    </button>
                    <button onClick={() => { setShowActionMenu(false); handleHeartClick(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Heart size={15} fill={isLiked ? "currentColor" : "none"} /> {isLiked ? "Saved" : "Save track"}
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Plus size={15} /> Add to playlist
                    </button>
                    <button onClick={() => { setShowActionMenu(false); setShowDownloadModal(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Download size={15} /> Download options
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-[#00E58C] transition-colors hover:bg-[#00E58C]/10 cursor-pointer">
                      <ShoppingCart size={15} /> License track
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Player Layout */}
          <div className="md:hidden w-full rounded-2xl bg-[#111317]/98 backdrop-blur-3xl border border-white/[0.12] p-3.5 flex items-center justify-between shadow-[0_18px_54px_rgba(0,0,0,0.68)] pointer-events-auto relative overflow-visible h-[86px]">
            <div className="flex items-center gap-3 overflow-hidden flex-1 z-10 text-left">
              {activeTrack.image ? (
                <img src={activeTrack.image} className="w-12 h-12 rounded-md object-cover shrink-0 border border-white/[0.06] shadow-sm" alt="" />
              ) : (
                <div className="w-12 h-12 rounded-md bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-500 shrink-0 border border-white/[0.06] shadow-sm">
                  {activeTrack.id.startsWith("s") ? "SFX" : "TRK"}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-[13px] font-medium text-white tracking-normal truncate leading-tight">{activeTrack.title}</span>
                <span className="text-[11px] text-neutral-400 truncate mt-0.5 leading-none">{activeTrack.artist}</span>
              </div>
            </div>
            <div className="relative flex items-center gap-2 shrink-0 pr-0 z-10">
              <button onClick={() => setIsExpanded(true)} className="text-neutral-400 p-1.5"><Maximize2 size={16} /></button>
              <button onClick={togglePlay} className="text-white p-1.5 flex items-center justify-center shrink-0">
                {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} />}
              </button>
              <button onClick={() => setShowActionMenu((current) => !current)} className="text-neutral-400 hover:text-white p-1.5" title="More player actions"><MoreHorizontal size={18} strokeWidth={2.2} /></button>
              <button onClick={closePlayerSurface} className="text-neutral-500 hover:text-white p-1.5" title="Close player"><X size={18} strokeWidth={2} /></button>

              <AnimatePresence>
                {showActionMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute bottom-[48px] right-2 z-40 w-52 rounded-xl border border-white/10 bg-[#15171b]/98 p-1.5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl"
                  >
                    <button onClick={() => { setShowActionMenu(false); setShowDetailsDrawer(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Info size={15} /> Track details
                    </button>
                    <button onClick={() => { setShowActionMenu(false); handleHeartClick(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Heart size={15} fill={isLiked ? "currentColor" : "none"} /> {isLiked ? "Saved" : "Save track"}
                    </button>
                    <button onClick={() => { setShowActionMenu(false); setShowDownloadModal(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer">
                      <Download size={15} /> Download
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-[#00E58C] transition-colors hover:bg-[#00E58C]/10 cursor-pointer">
                      <ShoppingCart size={15} /> License
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Minimal Mobile Progress Bar Overlay */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04] w-full z-0">
               <div 
                 className="h-full bg-[#00E58C]" 
                 style={{ width: `${activeDuration > 0 ? (progress / activeDuration) * 100 : 0}%` }}
               />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              4. OVERLAY DRAWERS & PANEL SLIDES
          ═══════════════════════════════════════════════ */}
          
          {/* A. Technical Metadata Sidebar Drawer */}
          <AnimatePresence>
            {showDetailsDrawer && (
              <>
                <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs pointer-events-auto" onClick={() => setShowDetailsDrawer(false)} />
                <motion.div 
                  initial={{ x: 380 }}
                  animate={{ x: 0 }}
                  exit={{ x: 380 }}
                  transition={{ type: "spring", stiffness: 380, damping: 35 }}
                  className="fixed right-0 top-0 bottom-0 w-[380px] bg-[#121316] border-l border-white/[0.08] p-6 z-[130] pointer-events-auto overflow-y-auto text-left shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-base font-black uppercase tracking-widest text-[#00E58C] flex items-center gap-2">
                        <Info size={16} /> Track Details
                      </h3>
                      <button onClick={() => setShowDetailsDrawer(false)} className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/[0.04]">
                        <X size={18} />
                      </button>
                    </div>

                    {/* Metadata details listing */}
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                        {activeTrack.image ? (
                          <img src={activeTrack.image} className="w-14 h-14 rounded-lg object-cover" alt="" />
                        ) : (
                          <div className="w-14 h-14 bg-neutral-800 rounded-lg flex items-center justify-center text-[10px] font-black text-neutral-500" />
                        )}
                        <div>
                          <h4 className="font-medium text-white leading-tight">{activeTrack.title}</h4>
                          <p className="text-xs text-neutral-400 font-normal mt-1">{activeTrack.artist}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                          <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">BPM</span>
                          <p className="text-sm font-bold text-white mt-1">{meta.bpm}</p>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                          <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Key Signature</span>
                          <p className="text-sm font-bold text-white mt-1">{meta.keySig}</p>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                          <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Genre</span>
                          <p className="text-sm font-bold text-white mt-1 capitalize">{meta.genre}</p>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                          <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Energy Level</span>
                          <p className="text-sm font-bold text-[#00E58C] mt-1">{meta.energy}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Mood Tags</span>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {meta.moods.map((m) => (
                            <span key={m} className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-[10px] font-bold text-neutral-300 rounded-full">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Primary Instruments</span>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {meta.instruments.map((inst) => (
                            <span key={inst} className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-[10px] font-bold text-neutral-300 rounded-full">
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-white/10" />

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Licensing Safe Check</span>
                        <div className="p-3.5 bg-[#00E58C]/5 border border-[#00E58C]/15 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#00E58C]">
                            <ShieldCheck size={14} /> 100% Monetization Clear
                          </div>
                          <p className="text-[11px] font-semibold text-neutral-400 leading-relaxed text-left">
                            {meta.usage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowDetailsDrawer(false); setIsExpanded(true); }}
                    className="w-full h-11 bg-white hover:bg-white/90 text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-8"
                  >
                    Open Immersive Panel <ArrowRight size={14} />
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* B. Similar Tracks Discover Drawer */}
          <AnimatePresence>
            {showSimilarDrawer && (
              <>
                <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs pointer-events-auto" onClick={() => setShowSimilarDrawer(false)} />
                <motion.div 
                  initial={{ x: 380 }}
                  animate={{ x: 0 }}
                  exit={{ x: 380 }}
                  transition={{ type: "spring", stiffness: 380, damping: 35 }}
                  className="fixed right-0 top-0 bottom-0 w-[380px] bg-[#121316] border-l border-white/[0.08] p-6 z-[130] pointer-events-auto overflow-y-auto text-left shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-base font-black uppercase tracking-widest text-[#00E58C] flex items-center gap-2">
                        <Sparkles size={16} /> Similar Tracks
                      </h3>
                      <button onClick={() => setShowSimilarDrawer(false)} className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/[0.04]">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {similarTracks.map((trk) => (
                        <div 
                          key={trk.id} 
                          className="p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300 flex items-center justify-between group/sim"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {trk.image ? (
                              <img src={trk.image} className="w-11 h-11 rounded-lg object-cover shrink-0" alt="" />
                            ) : (
                              <div className="w-11 h-11 bg-neutral-800 rounded-lg shrink-0 flex items-center justify-center text-[10px]" />
                            )}
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-[13px] leading-tight truncate group-hover/sim:text-[#00E58C] transition-colors">{trk.title}</h4>
                              <p className="text-xs text-neutral-400 font-semibold truncate mt-1">{trk.artist}</p>
                              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide mt-1 block">
                                {trk.bpm} BPM • {trk.keySig}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              usePlayerStore.getState().playTrack({
                                id: trk.id, title: trk.title, artist: trk.artist,
                                genre: trk.genre, bpm: trk.bpm, keySig: trk.keySig,
                                duration: trk.duration, image: trk.image, audioUrl: trk.audioUrl,
                                waveform: trk.waveform
                              });
                            }}
                            className="h-8 w-8 rounded-full bg-white text-black opacity-0 group-hover/sim:opacity-100 transition-opacity flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer shrink-0"
                          >
                            <Play size={12} fill="currentColor" className="translate-x-[0.5px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1 mt-8">
                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Discovery Engine</p>
                    <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                      Recommendations automatically synchronize based on matching BPM tempos, keys, genre markers, and instrument selections.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* C. Download Options format Card Modal */}
          <AnimatePresence>
            {showDownloadModal && (
              <>
                <div className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-sm pointer-events-auto" onClick={() => setShowDownloadModal(false)} />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px] bg-[#121316] border border-white/10 rounded-2xl p-6 z-[170] pointer-events-auto text-left shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black uppercase tracking-widest text-[#00E58C] flex items-center gap-2">
                      <Download size={16} /> Choose Download Format
                    </h3>
                    <button onClick={() => setShowDownloadModal(false)} className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/[0.04]">
                      <X size={18} />
                    </button>
                  </div>

                  {downloadingFormat ? (
                    // Packaging files progress overlay
                    <div className="py-10 text-center space-y-6">
                      <div className="h-12 w-12 border-4 border-[#00E58C]/25 border-t-[#00E58C] rounded-full animate-spin mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Compiling high-fidelity {downloadingFormat} Stems...</h4>
                        <p className="text-xs text-neutral-400 font-semibold">Wrapping license PDF, generating wav multi-tracks • {downloadProgress}%</p>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                        <div className="h-full bg-[#00E58C] transition-all duration-150" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    // Options selection list
                    <div className="space-y-4">
                      
                      {/* MP3 */}
                      <div 
                        onClick={() => handleFormatDownload("MP3")}
                        className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-between group/format"
                      >
                        <div>
                          <h4 className="font-bold text-white text-[14px]">MP3 (Standard Quality)</h4>
                          <p className="text-[11px] text-neutral-400 mt-1 font-semibold">320kbps Compressed Audio, standard license copy included.</p>
                        </div>
                        <ArrowRight size={16} className="text-neutral-500 group-hover/format:text-white transition-colors" />
                      </div>

                      {/* WAV */}
                      <div 
                        onClick={() => handleFormatDownload("WAV")}
                        className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-between group/format"
                      >
                        <div>
                          <h4 className="font-bold text-[#00E58C] text-[14px]">WAV (Lossless 24-bit / 48kHz)</h4>
                          <p className="text-[11px] text-neutral-400 mt-1 font-semibold">Lossless uncompressed audio for professional editors and film creators.</p>
                        </div>
                        <ArrowRight size={16} className="text-[#00E58C] group-hover/format:translate-x-1 transition-transform" />
                      </div>

                      {/* STEMS */}
                      <div 
                        onClick={() => handleFormatDownload("STEMS")}
                        className="p-4 bg-[#00E58C]/5 hover:bg-[#00E58C]/10 border border-[#00E58C]/15 rounded-xl transition-all cursor-pointer flex items-center justify-between group/format"
                      >
                        <div>
                          <h4 className="font-bold text-[#00E58C] text-[14px] flex items-center gap-2">
                            STEMS Multi-Tracks <Sparkles size={12} />
                          </h4>
                          <p className="text-[11px] text-[#00E58C]/80 mt-1 font-semibold">Separated Vocals, Drums, Bass, Melodics. Perfect for customized project mixes.</p>
                        </div>
                        <ArrowRight size={16} className="text-[#00E58C] group-hover/format:translate-x-1 transition-transform" />
                      </div>

                    </div>
                  )}

                  <div className="mt-6 text-[10px] text-neutral-500 text-center leading-relaxed">
                    Downloads automatically synchronize with your Tracknit Active License subscription and emit official safe monetization keys.
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              5. IMMERSIVE EXPANDED VIEWPORT WORKSPACE
          ═══════════════════════════════════════════════ */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                className="fixed inset-0 bg-[#0E1012] z-[150] pointer-events-auto flex flex-col justify-between overflow-y-auto text-left [&::-webkit-scrollbar]:hidden"
              >
                {/* Expanded Top Header panel */}
                <div className="h-[64px] border-b border-white/[0.06] px-8 flex items-center justify-between shrink-0 bg-[#121316]">
                  <div className="flex items-center gap-3.5">
                    <img alt="Tracknit" className="h-[32px] w-auto object-contain" src="/logo.svg" />
                    <span className="px-2 py-0.5 bg-[#00E58C]/10 border border-[#00E58C]/25 text-[8px] font-black uppercase text-[#00E58C] rounded tracking-widest mt-0.5 leading-none">
                      Creator Workstation
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowDetailsDrawer(true)} 
                      className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer leading-none"
                    >
                      <Info size={12} /> Specs
                    </button>
                    <button 
                      onClick={() => setIsExpanded(false)}
                      className="h-10 w-10 border border-white/10 hover:border-white/20 hover:text-white text-neutral-400 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Main Expanded Workspace Body Columns */}
                <div className="flex-1 w-full max-w-[1720px] mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  
                  {/* Left Column: Cover & Licensing Trust pillars */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-6 h-full">
                    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 relative shadow-2xl">
                      {activeTrack.image ? (
                        <img src={activeTrack.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-neutral-600">TRK</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 text-left">
                        <span className="px-2 py-1 bg-white/15 border border-white/20 rounded text-[9px] font-black tracking-widest text-white uppercase shadow-md leading-none">
                          {activeTrack.id.startsWith("s") ? "Sound Effect" : "Royalty-Free Music"}
                        </span>
                        <h2 className="text-2xl font-medium text-white tracking-normal mt-3 leading-tight">{activeTrack.title}</h2>
                        <p className="text-sm font-normal text-neutral-300 mt-1">{activeTrack.artist}</p>
                      </div>
                    </div>

                    {/* Trust indicator pills block */}
                    <div className="bg-[#121316] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-[#00E58C] flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Licensing Protection Clear
                      </h4>
                      <div className="grid grid-cols-2 gap-3.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                          <Check size={14} className="text-[#00E58C]" /> YouTube Safe
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                          <Check size={14} className="text-[#00E58C]" /> Commercial Use
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                          <Check size={14} className="text-[#00E58C]" /> Monetization Safe
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                          <Check size={14} className="text-[#00E58C]" /> Zero Claims
                        </div>
                      </div>
                      <div className="h-px bg-white/10" />
                      <p className="text-[11px] font-semibold text-neutral-400 leading-relaxed text-left">
                        This licensing workflow guarantees 100% protection against content ID copyright claims on YouTube, TikTok, Facebook, TV broadcast, and commercial advertisements.
                      </p>
                    </div>
                  </div>

                  {/* Center Column: DAW Waveform specs, versions selector, instrumentation */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-8 h-full text-left">
                    <div className="space-y-6">
                      
                      {/* Interactive symmetric waveform seeker (Large Immersive visual hero) */}
                      <div className="bg-[#121316] border border-white/[0.06] rounded-2xl p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Audio Timeline Spectrogram</span>
                          <span className="text-xs font-bold text-[#00E58C] tabular-nums tracking-wide">
                            {formatTime(progress)} / {formatTime(activeDuration)}
                          </span>
                        </div>

                        <div 
                          ref={waveformRef}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMoveWaveform}
                          onMouseEnter={handleMouseEnterWaveform}
                          onMouseLeave={handleMouseLeaveWaveform}
                          className="h-16 flex items-center cursor-pointer relative select-none"
                        >
                          {/* Centered symmetrical mirrored waveform bars */}
                          <div className="flex items-center gap-[1.5px] h-12 w-full relative z-10">
                            {activeWaves.map((heightPercent, i) => {
                              const barPercent = (i / WAVEFORM_BAR_COUNT) * 100;
                              const progressPercent = activeDuration > 0 ? (progress / activeDuration) * 100 : 0;
                              const isPlayed = barPercent <= progressPercent;

                              const distance = hoverIndex !== null ? Math.abs(i - hoverIndex) : 999;
                              const scale = distance <= 6 ? 1 + (0.35 * Math.cos((distance / 6) * (Math.PI / 2))) : 1;
                              
                              return (
                                <span
                                  key={i}
                                  className="flex-1 rounded-[1px] min-w-[1px] max-w-[2.5px] transition-all duration-75"
                                  style={{
                                    height: `${heightPercent * scale}%`,
                                    backgroundColor: isPlayed
                                      ? "#00E58C"
                                      : isHoveringWaveform && distance <= 6
                                      ? "rgba(255,255,255,0.45)"
                                      : "rgba(255,255,255,0.14)"
                                  }}
                                />
                              );
                            })}
                          </div>

                          {/* Hover Seek Preview Seekline */}
                          {isHoveringWaveform && hoverPercent !== null && activeDuration > 0 && (
                            <div 
                              className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center z-0" 
                              style={{ left: `${hoverPercent * 100}%` }}
                            >
                              <div className="h-full w-[1.5px] bg-white/20" />
                              <div className="absolute -top-[24px] -translate-x-1/2 bg-[#121316] text-[#00E58C] border border-white/10 text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_2px_8px_rgba(0,0,0,0.8)] whitespace-nowrap leading-none tracking-wider backdrop-blur-md">
                                {formatTime(hoverPercent * activeDuration)}
                              </div>
                            </div>
                          )}

                          {/* Draggable Active vertical white playhead line & floating elapsed time badge */}
                          {activeDuration > 0 && (
                            <div 
                              className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center z-20" 
                              style={{ left: `${(progress / activeDuration) * 100}%` }}
                            >
                              <div className="h-full w-[2px] bg-white relative shadow-[0_0_8px_#fff]" />
                              <div className="absolute -top-[24px] -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_2px_8px_rgba(255,255,255,0.4)] whitespace-nowrap leading-none tracking-wider">
                                {formatTime(progress)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Section markers block jump indicator buttons */}
                        <div className="flex justify-between items-center px-1 text-[9px] font-bold tracking-widest uppercase text-neutral-500 mt-2 select-none border-t border-white/[0.04] pt-2">
                          {SECTIONS.map((sec) => {
                            const isActiveSection = progress / activeDuration >= sec.start && progress / activeDuration < sec.end;
                            return (
                              <button
                                key={sec.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (soundRef.current && activeDuration > 0) {
                                    const seekTime = sec.start * activeDuration;
                                    soundRef.current.seek(seekTime);
                                    setProgress(seekTime);
                                  }
                                }}
                                className={`hover:text-white transition-colors cursor-pointer uppercase ${
                                  isActiveSection ? "text-[#00E58C] font-black scale-105" : "text-neutral-500"
                                }`}
                              >
                                {sec.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lossless Stems Volume Mixer */}
                      <div className="bg-[#121316] border border-white/[0.06] rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lossless Stems Volume Mixer</h4>
                            <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Control individual multi-track stems in real-time</p>
                          </div>
                          <span className="text-[9px] font-bold bg-[#00E58C]/10 text-[#00E58C] border border-[#00E58C]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            Lossless 24-Bit
                          </span>
                        </div>

                        {/* Stems Sliders Grid */}
                        <div className="grid grid-cols-4 gap-4 h-[210px] items-stretch pt-2">
                          {[
                            { name: "vocals", label: "Vocals", vol: vocalsVol, setVol: setVocalsVol, meter: vocalsMeter, color: "#00E58C" },
                            { name: "drums", label: "Drums", vol: drumsVol, setVol: setDrumsVol, meter: drumsMeter, color: "#C084FC" },
                            { name: "bass", label: "Bass", vol: bassVol, setVol: setBassVol, meter: bassMeter, color: "#00BFFF" },
                            { name: "melodies", label: "Melody", vol: melodiesVol, setVol: setMelodiesVol, meter: melodiesMeter, color: "#F97316" }
                          ].map((stem) => {
                            const isMuted = mutedStems.includes(stem.name);
                            const isSoloed = soloedStems.includes(stem.name);

                            const toggleMute = () => {
                              setMutedStems((prev) => 
                                prev.includes(stem.name) ? prev.filter(s => s !== stem.name) : [...prev, stem.name]
                              );
                            };

                            const toggleSolo = () => {
                              setSoloedStems((prev) => 
                                prev.includes(stem.name) ? prev.filter(s => s !== stem.name) : [stem.name]
                              );
                            };

                            return (
                              <div key={stem.name} className="flex flex-col items-center justify-between h-full bg-white/[0.01] border border-white/[0.03] rounded-lg p-2 relative">
                                
                                {/* Meter & Slider Stack */}
                                <div className="flex-1 flex gap-2 items-stretch h-[110px] w-full justify-center">
                                  {/* Dynamic Peak Meter */}
                                  <div className="w-1.5 bg-white/[0.04] rounded-full overflow-hidden relative flex flex-col justify-end">
                                    <motion.div 
                                      className="w-full rounded-full" 
                                      style={{ 
                                        height: `${stem.meter}%`, 
                                        backgroundColor: stem.color,
                                        boxShadow: `0 0 8px ${stem.color}`
                                      }}
                                    />
                                  </div>

                                  {/* Vertical Volume Slider Fader */}
                                  <div className="relative flex items-center justify-center w-5">
                                    <input 
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={stem.vol}
                                      {...{ orient: "vertical" }}
                                      onChange={(e) => stem.setVol(Number(e.target.value))}
                                      className="absolute inset-0 cursor-ns-resize opacity-0 w-full h-full"
                                      style={{ writingMode: "bt-lr", WebkitAppearance: "slider-vertical" } as any}
                                    />
                                    {/* Custom Fader Line */}
                                    <div className="w-[2px] bg-white/10 h-full rounded-full absolute" />
                                    {/* Custom Fader Handle */}
                                    <div 
                                      className="w-3.5 h-3.5 rounded bg-white hover:scale-110 active:scale-100 transition-all border border-neutral-700 shadow-md absolute pointer-events-none"
                                      style={{ bottom: `calc(${stem.vol}% - 7px)` }}
                                    />
                                  </div>
                                </div>

                                {/* Controls */}
                                <div className="space-y-1.5 w-full shrink-0 pt-2 border-t border-white/[0.04] mt-2">
                                  <div className="flex gap-1 justify-center">
                                    <button 
                                      onClick={toggleSolo}
                                      className={`w-5 h-5 rounded text-[8px] font-bold flex items-center justify-center border transition-all ${
                                        isSoloed 
                                          ? "bg-amber-400 border-amber-400 text-black shadow-[0_0_6px_rgba(251,191,36,0.3)]" 
                                          : "bg-white/[0.03] border-white/10 text-neutral-500 hover:text-white"
                                      }`}
                                      title="Solo"
                                    >
                                      S
                                    </button>
                                    <button 
                                      onClick={toggleMute}
                                      className={`w-5 h-5 rounded text-[8px] font-bold flex items-center justify-center border transition-all ${
                                        isMuted 
                                          ? "bg-red-500 border-red-500 text-white shadow-[0_0_6px_rgba(239,68,68,0.3)]" 
                                          : "bg-white/[0.03] border-white/10 text-neutral-500 hover:text-white"
                                      }`}
                                      title="Mute"
                                    >
                                      M
                                    </button>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-[9px] font-bold text-neutral-300 truncate uppercase leading-tight">{stem.label}</p>
                                    <p className="text-[8px] text-neutral-500 font-mono mt-0.5 tabular-nums leading-none">{stem.vol}%</p>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Alternate Edit Version Selector */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Alternate Edit Versions</span>
                        <div className="grid grid-cols-2 gap-3.5 pt-1">
                          {["Full Version", "60 Second", "30 Second", "15 Second", "Instrumental"].map((v) => {
                            const isSelected = selectedVersion === v;
                            return (
                              <button
                                key={v}
                                onClick={() => setSelectedVersion(v)}
                                className={`h-11 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-left flex items-center justify-between border ${
                                  isSelected 
                                    ? "bg-white text-black border-white" 
                                    : "bg-transparent text-white/70 border-white/10 hover:border-white/20 hover:text-white"
                                }`}
                              >
                                {v}
                                {isSelected && <Check size={14} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Instrument badges list */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Instrumentation Spec</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {meta.instruments.map((inst) => (
                            <span key={inst} className="px-3 py-1.5 bg-white/[0.03] border border-white/5 text-xs font-bold text-neutral-300 rounded-lg">
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Workstation specs metadata block */}
                    <div className="grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500 block">Tempo BPM</span>
                        <span className="text-lg font-bold text-white block mt-1">{meta.bpm} BPM</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500 block">Key Center</span>
                        <span className="text-lg font-bold text-white block mt-1">{meta.keySig}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500 block">Energy Intensity</span>
                        <span className="text-lg font-bold text-[#00E58C] block mt-1">{meta.energy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recommendations & Queue sequences */}
                  <div className="lg:col-span-3 flex flex-col justify-between space-y-6 h-full text-left">
                    
                    {/* Playing Queue Sequence */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Playing Session Queue</span>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{queueInfo.index} of {queueInfo.total}</span>
                      </div>
                      
                      <div className="space-y-3 bg-[#121316] border border-white/[0.06] rounded-xl p-4 max-h-[170px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {ALL_LIBRARY_TRACKS.map((t, index) => {
                          const isCur = t.title.toLowerCase() === activeTrack.title.toLowerCase();
                          return (
                            <div key={t.id} className="flex items-center justify-between text-xs">
                              <span className={`font-semibold truncate max-w-[170px] ${isCur ? "text-[#00E58C]" : "text-neutral-400"}`}>
                                {index + 1}. {t.title}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-bold uppercase">{t.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Similar discovering matcher cards list */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#00E58C]" /> Discovery recommendations
                      </span>

                      <div className="space-y-3.5">
                        {similarTracks.map((sim) => (
                          <div 
                            key={sim.id}
                            onClick={() => {
                              usePlayerStore.getState().playTrack({
                                id: sim.id, title: sim.title, artist: sim.artist,
                                genre: sim.genre, bpm: sim.bpm, keySig: sim.keySig,
                                duration: sim.duration, image: sim.image, audioUrl: sim.audioUrl,
                                waveform: sim.waveform
                              });
                            }}
                            className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer flex items-center gap-3.5"
                          >
                            <img src={sim.image} className="w-10 h-10 rounded object-cover shrink-0" alt="" />
                            <div className="min-w-0">
                              <h5 className="font-medium text-white text-xs truncate leading-tight">{sim.title}</h5>
                              <p className="text-[11px] text-neutral-400 mt-1 font-normal truncate leading-none">{sim.artist}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Primary actions buttons stack inside expanded screen */}
                    <div className="space-y-3 pt-6 border-t border-white/[0.06]">
                      <button 
                        onClick={() => { setShowDownloadModal(true); }}
                        className="w-full h-11 bg-white hover:bg-white/90 text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Download size={14} /> Download Options
                      </button>

                      <button 
                        onClick={() => {
                          const { addItem } = useCartStore.getState();
                          if (activeTrack) {
                            addItem(activeTrack, "Personal");
                          }
                        }}
                        className="w-full h-11 bg-[#00E58C] hover:bg-[#00E58C]/90 text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00E58C]/10 border border-[#00E58C]/30"
                      >
                        <ShoppingCart size={14} /> Buy Creator License
                      </button>
                    </div>

                  </div>

                </div>

                {/* Expanded bottom player controls wrapper (Tethered layout) */}
                <div className="h-[92px] border-t border-white/[0.06] px-8 flex items-center justify-between shrink-0 bg-[#121316]">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-xs font-bold text-neutral-400 tracking-tight leading-none uppercase">Now Playing Workspace</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm font-medium text-white tracking-normal leading-none">{activeTrack.title}</span>
                  </div>

                  {/* Playback trigger buttons */}
                  <div className="flex items-center gap-6 text-neutral-400">
                    <button className="hover:text-white cursor-pointer"><Shuffle size={16} /></button>
                    <button className="hover:text-white cursor-pointer"><SkipBack fill="currentColor" size={17} /></button>
                    
                    <button 
                      onClick={togglePlay} 
                      className="text-black flex items-center justify-center p-3 rounded-full bg-white hover:scale-105 transition-transform cursor-pointer shadow-md"
                    >
                      {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} className="translate-x-[0.5px]" />}
                    </button>
                    
                    <button className="hover:text-white cursor-pointer"><SkipForward fill="currentColor" size={17} /></button>
                    <button className="hover:text-white cursor-pointer"><Repeat size={16} /></button>
                  </div>

                  {/* CloseExpanded viewport control */}
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="px-5 py-2 border border-[#00E58C]/20 hover:border-[#00E58C]/40 rounded-full text-xs font-black uppercase tracking-widest text-[#00E58C] hover:text-[#00E58C]/90 hover:bg-[#00E58C]/10 transition-all cursor-pointer leading-none"
                  >
                    Minimize Workspace
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
