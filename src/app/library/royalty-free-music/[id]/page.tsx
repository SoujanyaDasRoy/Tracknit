import { getLibraryTracks, type LibraryTrack } from "@/lib/library-r2";
import TrackDetailPageClient from "./TrackDetailPageClient";
import { notFound } from "next/navigation";

// Combined master list of static fallback tracks to cover all possibilities at build time
const STATIC_TRACKS: LibraryTrack[] = [
  // Zustand initial tracks
  { id: "m1", kind: "music", title: "Ethereal Drift", artist: "Lunar Architect, Sol", genre: ["Electronic", "Chill", "Ambient"], bpm: 95, keySig: "Db Maj", duration: "04:32", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", energy: "Low", vocals: false, instruments: ["Synth", "Pad", "Sub Bass"], moods: ["Dreamy", "Ethereal", "Floating"], useCases: ["YouTube", "Podcasts", "Meditation"], downloads: 184 },
  { id: "m2", kind: "music", title: "Subzero Signal", artist: "Vector Field", genre: ["Techno", "Industrial", "Dark"], bpm: 128, keySig: "Am", duration: "05:14", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", energy: "High", vocals: false, instruments: ["Synth", "Drums", "Distorted Bass"], moods: ["Intense", "Aggressive", "Dark"], useCases: ["Gaming", "Trailers", "Action"], downloads: 312 },
  { id: "m3", kind: "music", title: "Neon Monolith", artist: "Chrome Pulse", genre: ["Synthwave", "Retro", "80s"], bpm: 114, keySig: "G Maj", duration: "03:45", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80", energy: "Medium", vocals: false, instruments: ["Synth", "Drums", "Electric Guitar"], moods: ["Nostalgic", "Energetic", "Driving"], useCases: ["YouTube", "Ads", "Gaming"], downloads: 0 },
  { id: "m4", kind: "music", title: "Velvet", artist: "Dylan Sitts", genre: ["Classical", "Epic", "Dreamy"], bpm: 89, keySig: "C Min", duration: "03:09", image: "https://images.unsplash.com/photo-1614613535308-f4c0ba474cdd?w=800&q=80", energy: "Low", vocals: false, instruments: ["Piano", "Strings", "Cello"], moods: ["Emotional", "Cinematic", "Tender"], useCases: ["Film", "Podcasts", "Corporate"], downloads: 97 },
  { id: "m5", kind: "music", title: "Big Steppa", artist: "dreem", genre: ["Garage", "Dark", "Restless"], bpm: 138, keySig: "Fm", duration: "03:06", image: "https://images.unsplash.com/photo-1621609761367-85b46e34ac11?w=800&q=80", energy: "High", vocals: false, instruments: ["Drums", "Bass", "Synth"], moods: ["Aggressive", "Raw", "Gritty"], useCases: ["Gaming", "Sports", "Trailers"], downloads: 256 },
  { id: "m6", kind: "music", title: "Bongololo", artist: "Kouba", genre: ["Amapiano", "Beats", "Epic"], bpm: 120, keySig: "Ab", duration: "03:04", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80", energy: "Medium", vocals: false, instruments: ["Percussion", "Log Drums", "Synth"], moods: ["Groovy", "Uplifting", "Fun"], useCases: ["YouTube", "Social Media", "Ads"], downloads: 0 },
  { id: "m7", kind: "music", title: "Unconventional", artist: "Howard Harper", genre: ["Contemporary", "Hopeful", "Dreamy"], bpm: 74, keySig: "E Maj", duration: "03:11", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80", energy: "Low", vocals: true, instruments: ["Acoustic Guitar", "Piano", "Strings"], moods: ["Hopeful", "Warm", "Inspiring"], useCases: ["Podcasts", "Corporate", "Film"], downloads: 143 },
  { id: "m8", kind: "music", title: "Night Runner", artist: "Synth Lord", genre: ["Retrowave", "Driving", "Action"], bpm: 130, keySig: "D Min", duration: "04:12", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", energy: "High", vocals: false, instruments: ["Synth", "Drums", "Bass"], moods: ["Energetic", "Exciting", "Bold"], useCases: ["Gaming", "Trailers", "YouTube"], downloads: 201 },

  // Royalty-free-music/page.tsx fallback tracks
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

interface PageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Generate all static paths at build-time to offload computation to edge caches and guarantee 0ms CPU load
  try {
    const r2Tracks = await getLibraryTracks("music");
    const ids = new Set<string>();
    r2Tracks.forEach(t => ids.add(t.id));
    STATIC_TRACKS.forEach(t => ids.add(t.id));
    return Array.from(ids).map(id => ({ id }));
  } catch {
    return STATIC_TRACKS.map(t => ({ id: t.id }));
  }
}

export default async function TrackDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 1. Fetch tracks from Cloudflare R2 or WordPress REST api if available, then fallback
  let trackList: LibraryTrack[] = [];
  try {
    trackList = await getLibraryTracks("music");
  } catch {
    // ignore
  }

  // Combine fetched and static lists
  const allTracks = [...trackList, ...STATIC_TRACKS];

  // 2. Find exact track
  const track = allTracks.find(t => t.id === id);

  if (!track) {
    notFound();
  }

  // 3. Find similar tracks (sharing at least one genre, up to 5 tracks)
  const similarTracks = allTracks
    .filter(t => t.id !== track.id && t.genre.some(g => track.genre.includes(g)))
    .slice(0, 5);

  return <TrackDetailPageClient track={track} similarTracks={similarTracks} />;
}
