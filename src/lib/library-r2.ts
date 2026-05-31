import type { Track } from "@/store/usePlayerStore";

export type LibraryKind = "music" | "sfx";

export type LibraryTrack = Track & {
  kind: LibraryKind;
  waveform?: number[];
  tags?: string[];
  moods?: string[];
  useCases?: string[];
  instruments?: string[];
  featured?: boolean;
  description?: string;
  downloads?: number;
  category?: string;
  type?: string;
  explicit?: boolean;
  vocals?: boolean;
};

type R2ManifestTrack = Partial<LibraryTrack> & {
  audio?: string;
  audioKey?: string;
  imageKey?: string;
  cover?: string;
  coverKey?: string;
};

const R2_PUBLIC_BASE =
  process.env.TRACKNIT_R2_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_TRACKNIT_R2_PUBLIC_URL ||
  "";

const MANIFEST_PATHS: Record<LibraryKind, string> = {
  music: process.env.TRACKNIT_R2_MUSIC_MANIFEST || "library/music.json",
  sfx: process.env.TRACKNIT_R2_SFX_MANIFEST || "library/sfx.json",
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const FALLBACK_COVERS: Record<string, string> = {
  "covers/music/ethereal-drift.jpg": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
  "covers/music/subzero-signal.jpg": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  "covers/music/velvet.jpg": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80",
  "covers/music/night-runner.jpg": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
  "covers/sfx/hud-confirm.jpg": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
  "covers/sfx/metal-door-slam.jpg": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  "covers/sfx/cyberpunk-glitch.jpg": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  "covers/sfx/rain-window.jpg": "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=400&q=80",
};

export function getR2AssetUrl(value?: string) {
  if (!value) return "";
  if (isAbsoluteUrl(value)) return value;
  if (!R2_PUBLIC_BASE) {
    if (value.startsWith("covers/")) {
      return FALLBACK_COVERS[value] || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80";
    }
    // For audio previews, fallback to a stable soundhelix URL if no R2 base is configured
    if (value.startsWith("previews/")) {
      const seed = value.replace("previews/", "").replace(/\.[^/.]+$/, "");
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
      const index = (Math.abs(h) % 8) + 1;
      return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index}.mp3`;
    }
    return "";
  }

  return `${R2_PUBLIC_BASE.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

function normalizeManifestTrack(track: R2ManifestTrack, kind: LibraryKind, index: number): LibraryTrack {
  const id = track.id || `${kind}-${index + 1}`;
  const image = getR2AssetUrl(track.image || track.imageKey || track.cover || track.coverKey);
  const audioUrl = getR2AssetUrl(track.audioUrl || track.audio || track.audioKey);

  return {
    id,
    kind,
    title: track.title || "Untitled",
    artist: track.artist || (kind === "music" ? "Tracknit Artists" : "Tracknit Sound"),
    genre: Array.isArray(track.genre) && track.genre.length ? track.genre : ["Curated"],
    bpm: track.bpm || (kind === "music" ? "-" : "-"),
    keySig: track.keySig || "-",
    duration: track.duration || "0:00",
    image,
    audioUrl,
    waveform: track.waveform,
    tags: track.tags,
    moods: track.moods,
    useCases: track.useCases,
    featured: track.featured,
    description: track.description,
    downloads: track.downloads,
    explicit: track.explicit,
    vocals: track.vocals,
  };
}

async function fetchManifest(kind: LibraryKind): Promise<LibraryTrack[]> {
  if (!R2_PUBLIC_BASE && !isAbsoluteUrl(MANIFEST_PATHS[kind])) return [];

  const manifestUrl = getR2AssetUrl(MANIFEST_PATHS[kind]);
  const response = await fetch(manifestUrl, { next: { revalidate: 300 } });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${kind} manifest from R2: ${response.status}`);
  }

  const payload = await response.json();
  const rows: R2ManifestTrack[] = Array.isArray(payload) ? payload : payload.tracks || [];

  return rows.map((track, index) => normalizeManifestTrack(track, kind, index));
}

const fallbackTracks: Record<LibraryKind, LibraryTrack[]> = {
  music: [
    {
      id: "music-ethereal-drift",
      kind: "music",
      title: "Ethereal Drift",
      artist: "Lunar Architect",
      genre: ["Ambient", "Electronic", "Cinematic"],
      bpm: 95,
      keySig: "Db Maj",
      duration: "4:32",
      image: getR2AssetUrl("covers/music/ethereal-drift.jpg"),
      audioUrl: getR2AssetUrl("previews/music/ethereal-drift.mp3"),
      moods: ["Weightless", "Dreamy", "Warm"],
      useCases: ["Documentary", "YouTube", "Brand Film"],
      downloads: 184,
      featured: true,
    },
    {
      id: "music-subzero-signal",
      kind: "music",
      title: "Subzero Signal",
      artist: "Vector Field",
      genre: ["Industrial", "Techno", "Dark"],
      bpm: 128,
      keySig: "Am",
      duration: "5:14",
      image: getR2AssetUrl("covers/music/subzero-signal.jpg"),
      audioUrl: getR2AssetUrl("previews/music/subzero-signal.mp3"),
      moods: ["Tense", "Kinetic", "Noir"],
      useCases: ["Gaming", "Trailers", "Action"],
      downloads: 312,
    },
    {
      id: "music-velvet",
      kind: "music",
      title: "Velvet",
      artist: "Dylan Sitts",
      genre: ["Piano", "Strings", "Emotional"],
      bpm: 89,
      keySig: "C Min",
      duration: "3:09",
      image: getR2AssetUrl("covers/music/velvet.jpg"),
      audioUrl: getR2AssetUrl("previews/music/velvet.mp3"),
      moods: ["Tender", "Cinematic", "Human"],
      useCases: ["Film", "Podcasts", "Corporate"],
      downloads: 97,
    },
    {
      id: "music-night-runner",
      kind: "music",
      title: "Night Runner",
      artist: "Synth Lord",
      genre: ["Retrowave", "Driving", "Action"],
      bpm: 130,
      keySig: "D Min",
      duration: "4:12",
      image: getR2AssetUrl("covers/music/night-runner.jpg"),
      audioUrl: getR2AssetUrl("previews/music/night-runner.mp3"),
      moods: ["Fast", "Bold", "Electric"],
      useCases: ["Gaming", "Trailers", "YouTube"],
      downloads: 201,
    },
    {
      id: "music-studied-abroad",
      kind: "music",
      title: "Studied Abroad",
      artist: "Neon Beach",
      genre: ["Indie Pop", "Upbeat", "Lifestyle"],
      bpm: 118,
      keySig: "G Maj",
      duration: "2:18",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      moods: ["Fun", "Happy", "Hopeful", "Inspiring"],
      useCases: ["Travel", "YouTube", "Social Ads"],
      downloads: 428,
      featured: true,
    },
    {
      id: "music-golden-hour-drive",
      kind: "music",
      title: "Golden Hour Drive",
      artist: "Satin Waves",
      genre: ["Pop", "Electronic", "Corporate"],
      bpm: 104,
      keySig: "A Maj",
      duration: "2:47",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      moods: ["Bright", "Warm", "Optimistic", "Clean"],
      useCases: ["Brand Film", "Podcast", "Reels"],
      downloads: 265,
    },
    {
      id: "music-morning-edit",
      kind: "music",
      title: "Morning Edit",
      artist: "Cove District",
      genre: ["Acoustic", "Folk", "Minimal"],
      bpm: 82,
      keySig: "E Maj",
      duration: "3:02",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      moods: ["Calm", "Human", "Hopeful", "Tender"],
      useCases: ["Documentary", "Vlog", "Wellness"],
      downloads: 154,
    },
    {
      id: "music-electric-weekend",
      kind: "music",
      title: "Electric Weekend",
      artist: "Metro Bloom",
      genre: ["Dance", "Nu Disco", "Pop"],
      bpm: 122,
      keySig: "F# Min",
      duration: "2:56",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      moods: ["Fun", "Confident", "Upbeat", "Stylish"],
      useCases: ["Fashion", "Commercial", "Fitness"],
      downloads: 341,
    },
    {
      id: "music-soft-launch",
      kind: "music",
      title: "Soft Launch",
      artist: "Minimal State",
      genre: ["Ambient", "Tech", "Corporate"],
      bpm: 96,
      keySig: "C Maj",
      duration: "2:34",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      moods: ["Clean", "Focused", "Modern", "Light"],
      useCases: ["SaaS", "Explainer", "Product Demo"],
      downloads: 189,
    },
    {
      id: "music-after-rain",
      kind: "music",
      title: "After Rain",
      artist: "Hollow Pines",
      genre: ["Piano", "Cinematic", "Ambient"],
      bpm: 72,
      keySig: "D Maj",
      duration: "3:41",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      moods: ["Reflective", "Emotional", "Peaceful", "Warm"],
      useCases: ["Film", "Nonprofit", "Storytelling"],
      downloads: 231,
    },
    {
      id: "music-camera-ready",
      kind: "music",
      title: "Camera Ready",
      artist: "Velvet Motion",
      genre: ["Hip Hop", "Lo-Fi", "Urban"],
      bpm: 88,
      keySig: "Bb Min",
      duration: "2:25",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      moods: ["Cool", "Smooth", "Confident", "Laid Back"],
      useCases: ["Creator", "Tutorial", "Lifestyle"],
      downloads: 309,
    },
    {
      id: "music-bright-brief",
      kind: "music",
      title: "Bright Brief",
      artist: "Northline",
      genre: ["Corporate", "Pop", "Acoustic"],
      bpm: 112,
      keySig: "B Maj",
      duration: "2:09",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      moods: ["Hopeful", "Positive", "Polished", "Friendly"],
      useCases: ["Business", "Course", "Presentation"],
      downloads: 176,
    },
  ],
  sfx: [
    {
      id: "sfx-hud-confirm",
      kind: "sfx",
      title: "Sci-Fi HUD Confirm",
      artist: "UI Sounds",
      genre: ["Interface", "Digital", "Clean"],
      bpm: "-",
      keySig: "-",
      duration: "0:02",
      image: getR2AssetUrl("covers/sfx/hud-confirm.jpg"),
      audioUrl: getR2AssetUrl("previews/sfx/hud-confirm.mp3"),
      tags: ["UI", "Short", "Positive"],
      downloads: 92,
      featured: true,
    },
    {
      id: "sfx-metal-door-slam",
      kind: "sfx",
      title: "Heavy Metal Door Slam",
      artist: "Foley Lab",
      genre: ["Impact", "Heavy", "Metal"],
      bpm: "-",
      keySig: "-",
      duration: "0:04",
      image: getR2AssetUrl("covers/sfx/metal-door-slam.jpg"),
      audioUrl: getR2AssetUrl("previews/sfx/metal-door-slam.mp3"),
      tags: ["Foley", "Impact", "Industrial"],
      downloads: 148,
    },
    {
      id: "sfx-cyberpunk-glitch",
      kind: "sfx",
      title: "Cyberpunk Glitch",
      artist: "Transitions",
      genre: ["Glitch", "Tech", "Fast"],
      bpm: "-",
      keySig: "-",
      duration: "0:03",
      image: getR2AssetUrl("covers/sfx/cyberpunk-glitch.jpg"),
      audioUrl: getR2AssetUrl("previews/sfx/cyberpunk-glitch.mp3"),
      tags: ["Transition", "Digital", "Sharp"],
      downloads: 205,
    },
    {
      id: "sfx-rain-window",
      kind: "sfx",
      title: "Rain on Window",
      artist: "Nature Atmos",
      genre: ["Rain", "Ambient", "Calm"],
      bpm: "-",
      keySig: "-",
      duration: "1:20",
      image: getR2AssetUrl("covers/sfx/rain-window.jpg"),
      audioUrl: getR2AssetUrl("previews/sfx/rain-window.mp3"),
      tags: ["Atmosphere", "Nature", "Loop"],
      downloads: 177,
    },
    {
      id: "sfx-cinematic-whoosh",
      kind: "sfx",
      title: "Cinematic Whoosh",
      artist: "Sound Design",
      genre: ["Transition", "Cinematic", "Sweep"],
      bpm: "-",
      keySig: "-",
      duration: "0:05",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      tags: ["Whoosh", "Trailer", "Fast"],
      moods: ["Epic", "Clean"],
      downloads: 690,
    },
    {
      id: "sfx-digital-beep",
      kind: "sfx",
      title: "Digital Beep",
      artist: "UI Sounds",
      genre: ["Interface", "Notification", "Digital"],
      bpm: "-",
      keySig: "-",
      duration: "0:01",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      tags: ["UI", "Short", "Clean"],
      moods: ["Digital", "Positive"],
      downloads: 180,
    },
    {
      id: "sfx-deep-boom",
      kind: "sfx",
      title: "Deep Boom",
      artist: "Impact Lab",
      genre: ["Impact", "Trailer", "Low End"],
      bpm: "-",
      keySig: "-",
      duration: "0:06",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      tags: ["Impact", "Sub", "Heavy"],
      moods: ["Heavy", "Dark"],
      downloads: 330,
    },
    {
      id: "sfx-windy-forest",
      kind: "sfx",
      title: "Windy Forest",
      artist: "Nature Atmos",
      genre: ["Ambience", "Nature", "Wind"],
      bpm: "-",
      keySig: "-",
      duration: "2:15",
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      tags: ["Loop", "Nature", "Atmosphere"],
      moods: ["Nature", "Calm"],
      downloads: 290,
    },
  ],
};

export async function getLibraryTracks(kind: LibraryKind) {
  try {
    const tracks = await fetchManifest(kind);
    return tracks.length ? tracks : fallbackTracks[kind];
  } catch {
    return fallbackTracks[kind];
  }
}
