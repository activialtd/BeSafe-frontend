import { Location, Ride } from "@/types";
import { api } from "./api";
import { endpoints } from "./endpoints";

const unwrap = (res: any) => res.data?.data || res.data;

export const ridesService = {
  async start(vehicleId: string): Promise<Ride> {
    const res = await api.post(endpoints.rides.start, { vehicleId });
    return unwrap(res);
  },

  async end(
    rideId: string,
    reason: "arrived" | "cancelled" | "sos_resolved" = "arrived",
  ): Promise<{ ended: boolean }> {
    const res = await api.post(endpoints.rides.end(rideId), { reason });
    return unwrap(res);
  },

  async updateLocation(
    rideId: string,
    loc: Location & { accuracyMeters?: number; speedMps?: number },
  ): Promise<void> {
    await api.post(endpoints.rides.ping(rideId), {
      lat: loc.lat,
      lng: loc.lng,
      accuracyMeters: loc.accuracyMeters,
      speedMps: loc.speedMps,
      source: "http",
    });
  },

  async setSharedWith(rideId: string, contactIds: string[]): Promise<void> {
    await api.put(endpoints.rides.shares(rideId), { contactIds });
  },

  async history(): Promise<Ride[]> {
    try {
      const res = await api.get(endpoints.rides.history);
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
};
