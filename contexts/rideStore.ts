import { Ride, SosEvent } from '@/types';
import { create } from 'zustand';

interface RideState {
  activeRide: Ride | null;
  activeSos: SosEvent | null;
  setActiveRide: (r: Ride | null) => void;
  setActiveSos: (s: SosEvent | null) => void;
  clearAll: () => void;
}

export const useRide = create<RideState>((set) => ({
  activeRide: null,
  activeSos: null,
  setActiveRide: (r) => set({ activeRide: r }),
  setActiveSos: (s) => set({ activeSos: s }),
  clearAll: () => set({ activeRide: null, activeSos: null }),
}));
