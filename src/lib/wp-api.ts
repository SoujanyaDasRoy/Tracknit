export const WP_API_URL = process.env.NEXT_PUBLIC_WP_URL || "";

export interface WPTrack {
  id: number;
  slug: string;
  title: { rendered: string };
  meta: {
    _tracknit_artist: string;
    _tracknit_preview_url: string;
    _tracknit_cover_url: string;
    _tracknit_thumb_url: string;
    _tracknit_bpm: number;
    _tracknit_duration: string;
    _tracknit_key: string;
    _tracknit_vocals: boolean;
    _tracknit_energy: string;
  };
  tracknit_genres: number[];
  tracknit_moods: number[];
}

export async function getTracks(): Promise<any[]> {
  if (!WP_API_URL) {
    // No WordPress API configured, return empty array to fallback to mock data
    return [];
  }

  try {
    const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/track?_embed&per_page=100`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error("Failed to fetch tracks from WP");

    const wpTracks: WPTrack[] = await res.json();

    // Map WP fields to our Next.js model
    return wpTracks.map(track => ({
      id: track.id.toString(),
      title: track.title.rendered,
      artist: track.meta?._tracknit_artist || "Unknown Artist",
      genre: ["Electronic"], // We'd map taxonomy IDs to names ideally
      bpm: track.meta?._tracknit_bpm || 120,
      keySig: track.meta?._tracknit_key || "C",
      duration: track.meta?._tracknit_duration || "0:00",
      image: track.meta?._tracknit_cover_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      energy: track.meta?._tracknit_energy || "Medium",
      vocals: track.meta?._tracknit_vocals || false,
      instruments: ["Synth"],
      moods: ["Chill"],
      useCases: ["YouTube"],
      audioUrl: track.meta?._tracknit_preview_url || undefined
    }));
  } catch (error) {
    // Log error for debugging but return empty array to prevent UI breakage
    console.error("Error fetching from WP:", error);
    return [];
  }
}
