import { create } from "zustand";
import { apiFetch } from "@/lib/api-client";

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string[];
  bpm: number | string;
  keySig: string;
  duration: string;
  image: string;
  audioUrl?: string;
  waveform?: number[];
}

interface PlayerState {
  activeTrack: Track | null;
  isPlaying: boolean;
  isPlayerVisible: boolean;
  likedTrackIds: string[]; // User's favorites list
  progress: number;
  duration: number;
  seekTo: number | null;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  closePlayer: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setLikedTrackIds: (ids: string[]) => void;
  toggleLike: (trackId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setSeekTo: (seekTo: number | null) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  activeTrack: null,
  isPlaying: false,
  isPlayerVisible: false,
  likedTrackIds: [],
  progress: 0,
  duration: 0,
  seekTo: null,

  playTrack: (track) => set({
    activeTrack: track,
    isPlaying: true,
    isPlayerVisible: true,
    progress: 0,
    seekTo: null,
  }),

  togglePlay: () => set((state) => ({ 
    isPlaying: !state.isPlaying 
  })),

  closePlayer: () => set({ 
    activeTrack: null,
    isPlaying: false,
    isPlayerVisible: false 
  }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setLikedTrackIds: (ids) => set({ likedTrackIds: ids }),

  toggleLike: async (trackId) => {
    const currentLiked = get().likedTrackIds;
    const isCurrentlyLiked = currentLiked.includes(trackId);

    // 1. Optimistic Update (Immediate UI response)
    const newLiked = isCurrentlyLiked
      ? currentLiked.filter(id => id !== trackId)
      : [...currentLiked, trackId];
    
    set({ likedTrackIds: newLiked });

    // 2. Synchronize with Backend
    try {
      if (isCurrentlyLiked) {
        // DELETE favorite
        await apiFetch(`/user/favorites/${trackId}`, { method: "DELETE" });
      } else {
        // POST favorite
        await apiFetch("/user/favorites", {
          method: "POST",
          body: JSON.stringify({
            post_id: trackId,
            post_type: trackId.startsWith("s") ? "tn_sfx" : "tn_track"
          })
        });
      }
    } catch (err) {
      console.error("Failed to sync favorite with backend, rolling back state:", err);
      // Rollback state if network request fails
      set({ likedTrackIds: currentLiked });
      throw err; // Propagate error so calling views can display warning toast if desired
    }
  },

  fetchFavorites: async () => {
    try {
      const response = await apiFetch("/user/favorites");
      const data = await response.json();
      // Expecting backend to return an array of post objects or raw IDs
      if (Array.isArray(data)) {
        const ids = data.map((fav: any) => (fav.post_id || fav.id).toString());
        set({ likedTrackIds: ids });
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setSeekTo: (seekTo) => set({ seekTo })
}));
