import { create } from "zustand";

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string[];
  bpm: number | string;
  keySig: string;
  duration: string;
  image: string;
  energy?: string;
  vocals?: boolean;
  instruments?: string[];
  moods?: string[];
  useCases?: string[];
  status?: "published" | "draft";
  downloads?: number;
  waveform?: number[];
  date?: string;
}

const INITIAL_TRACKS: Track[] = [
  { id: "m1", title: "Ethereal Drift", artist: "Lunar Architect, Sol", genre: ["Electronic", "Chill", "Ambient"], bpm: 95, keySig: "Db Maj", duration: "04:32", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", energy: "Low", vocals: false, instruments: ["Synth", "Pad", "Sub Bass"], moods: ["Dreamy", "Ethereal", "Floating"], useCases: ["YouTube", "Podcasts", "Meditation"], status: "published", downloads: 184, date: "Apr 18, 2026" },
  { id: "m2", title: "Subzero Signal", artist: "Vector Field", genre: ["Techno", "Industrial", "Dark"], bpm: 128, keySig: "Am", duration: "05:14", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", energy: "High", vocals: false, instruments: ["Synth", "Drums", "Distorted Bass"], moods: ["Intense", "Aggressive", "Dark"], useCases: ["Gaming", "Trailers", "Action"], status: "published", downloads: 312, date: "Apr 17, 2026" },
  { id: "m3", title: "Neon Monolith", artist: "Chrome Pulse", genre: ["Synthwave", "Retro", "80s"], bpm: 114, keySig: "G Maj", duration: "03:45", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80", energy: "Medium", vocals: false, instruments: ["Synth", "Drums", "Electric Guitar"], moods: ["Nostalgic", "Energetic", "Driving"], useCases: ["YouTube", "Ads", "Gaming"], status: "draft", downloads: 0, date: "Apr 16, 2026" },
  { id: "m4", title: "Velvet", artist: "Dylan Sitts", genre: ["Classical", "Epic", "Dreamy"], bpm: 89, keySig: "C Min", duration: "03:09", image: "https://images.unsplash.com/photo-1614613535308-f4c0ba474cdd?w=800&q=80", energy: "Low", vocals: false, instruments: ["Piano", "Strings", "Cello"], moods: ["Emotional", "Cinematic", "Tender"], useCases: ["Film", "Podcasts", "Corporate"], status: "published", downloads: 97, date: "Apr 15, 2026" },
  { id: "m5", title: "Big Steppa", artist: "dreem", genre: ["Garage", "Dark", "Restless"], bpm: 138, keySig: "Fm", duration: "03:06", image: "https://images.unsplash.com/photo-1621609761367-85b46e34ac11?w=800&q=80", energy: "High", vocals: false, instruments: ["Drums", "Bass", "Synth"], moods: ["Aggressive", "Raw", "Gritty"], useCases: ["Gaming", "Sports", "Trailers"], status: "published", downloads: 256, date: "Apr 14, 2026" },
  { id: "m6", title: "Bongololo", artist: "Kouba", genre: ["Amapiano", "Beats", "Epic"], bpm: 120, keySig: "Ab", duration: "03:04", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80", energy: "Medium", vocals: false, instruments: ["Percussion", "Log Drums", "Synth"], moods: ["Groovy", "Uplifting", "Fun"], useCases: ["YouTube", "Social Media", "Ads"], status: "draft", downloads: 0, date: "Apr 14, 2026" },
  { id: "m7", title: "Unconventional", artist: "Howard Harper", genre: ["Contemporary", "Hopeful", "Dreamy"], bpm: 74, keySig: "E Maj", duration: "03:11", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80", energy: "Low", vocals: true, instruments: ["Acoustic Guitar", "Piano", "Strings"], moods: ["Hopeful", "Warm", "Inspiring"], useCases: ["Podcasts", "Corporate", "Film"], status: "published", downloads: 143, date: "Apr 13, 2026" },
  { id: "m8", title: "Night Runner", artist: "Synth Lord", genre: ["Retrowave", "Driving", "Action"], bpm: 130, keySig: "D Min", duration: "04:12", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", energy: "High", vocals: false, instruments: ["Synth", "Drums", "Bass"], moods: ["Energetic", "Exciting", "Bold"], useCases: ["Gaming", "Trailers", "YouTube"], status: "published", downloads: 201, date: "Apr 12, 2026" },
];

interface TrackStore {
  tracks: Track[];
  addTrack: (track: Track) => void;
  deleteTrack: (id: string) => void;
  updateTrack: (id: string, data: Partial<Track>) => void;
}

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: INITIAL_TRACKS,
  addTrack: (track) => set((state) => ({ tracks: [track, ...state.tracks] })),
  deleteTrack: (id) => set((state) => ({ tracks: state.tracks.filter((t) => t.id !== id) })),
  updateTrack: (id, data) => set((state) => ({
    tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...data } : t))
  }))
}));
