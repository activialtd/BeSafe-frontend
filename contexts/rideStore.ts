import { Driver, Ride, SosEvent, Vehicle } from "@/types";
import { create } from "zustand";

interface RideState {
  activeRide: Ride | null;
  activeDriver: Driver | null;
  activeVehicle: Vehicle | null;
  activeSos: SosEvent | null;
  setActiveRide: (r: Ride | null, driver?: Driver, vehicle?: Vehicle) => void;
  setActiveSos: (s: SosEvent | null) => void;
  clearAll: () => void;
}

export const useRide = create<RideState>((set) => ({
  activeRide: null,
  activeDriver: null,
  activeVehicle: null,
  activeSos: null,
  setActiveRide: (r, driver, vehicle) =>
    set({
      activeRide: r,
      activeDriver: driver ?? null,
      activeVehicle: vehicle ?? null,
    }),
  setActiveSos: (s) => set({ activeSos: s }),
  clearAll: () =>
    set({
      activeRide: null,
      activeDriver: null,
      activeVehicle: null,
      activeSos: null,
    }),
}));
