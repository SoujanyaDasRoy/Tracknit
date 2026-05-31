import { create } from "zustand";
import { Track } from "./useTrackStore";

export type LicenseTier = "Personal" | "Commercial" | "Enterprise";

export interface CartItem {
  track: Track;
  licenseType: LicenseTier;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (track: Track, licenseType?: LicenseTier) => void;
  removeItem: (trackId: string, licenseType: LicenseTier) => void;
  updateTier: (trackId: string, oldLicense: LicenseTier, newLicense: LicenseTier) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getCartTotal: () => number;
}

const TIER_PRICES: Record<LicenseTier, number> = {
  Personal: 29,
  Commercial: 99,
  Enterprise: 299,
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (track, licenseType = "Personal") => set((state) => {
    const alreadyInCart = state.items.some(
      (item) => item.track.id === track.id && item.licenseType === licenseType
    );

    if (alreadyInCart) {
      return { isOpen: true }; // Just open the cart drawer if it's already there
    }

    const newItem: CartItem = {
      track,
      licenseType,
      price: TIER_PRICES[licenseType],
    };

    return {
      items: [...state.items, newItem],
      isOpen: true,
    };
  }),

  removeItem: (trackId, licenseType) => set((state) => ({
    items: state.items.filter(
      (item) => !(item.track.id === trackId && item.licenseType === licenseType)
    ),
  })),

  updateTier: (trackId, oldLicense, newLicense) => set((state) => ({
    items: state.items.map((item) => {
      if (item.track.id === trackId && item.licenseType === oldLicense) {
        return {
          ...item,
          licenseType: newLicense,
          price: TIER_PRICES[newLicense],
        };
      }
      return item;
    }),
  })),

  clearCart: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.price, 0);
  },
}));
