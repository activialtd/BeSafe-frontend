import { mockTripHistory } from "@/data/mockData";
import { Location, Ride } from "@/types";
import { api, mockDelay, USE_MOCK } from "./api";
import { endpoints } from "./endpoints";

export const ridesService = {
  /**
   * Start a monitored trip. No pickup / destination — this just begins the
   * "someone is watching me right now" timespan.
   */
  async start(vehicleId: string, driverId: string): Promise<Ride> {
    if (USE_MOCK) {
      const ride: Ride = {
        id: "ride_" + Date.now(),
        riderId: "user_r_001",
        driverId,
        vehicleId,
        status: "active",
        startedAt: new Date().toISOString(),
        sharedWith: [],
      };
      return mockDelay(ride, 400);
    }
    const { data } = await api.post(endpoints.rides.start, {
      vehicleId,
      driverId,
    });
    return data;
  },

  /** Rider tapped "arrived safely". */
  async end(rideId: string): Promise<Ride> {
    if (USE_MOCK) {
      return mockDelay(
        {
          id: rideId,
          riderId: "user_r_001",
          driverId: "user_d_002",
          vehicleId: "veh_001",
          status: "completed",
          startedAt: new Date(Date.now() - 20 * 60000).toISOString(),
          endedAt: new Date().toISOString(),
          sharedWith: [],
        } as Ride,
        400,
      );
    }
    const { data } = await api.post(endpoints.rides.end(rideId));
    return data;
  },

  /** Push a new location ping while a ride is active. */
  async updateLocation(rideId: string, loc: Location): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined, 100);
    await api.post(endpoints.rides.updateLocation(rideId), loc);
  },

  /** Add / remove contacts allowed to watch the trip live. */
  async setSharedWith(rideId: string, contactIds: string[]): Promise<void> {
    if (USE_MOCK) return mockDelay(undefined, 150);
    await api.post(endpoints.rides.shareLink(rideId), { contactIds });
  },

  async history(): Promise<Ride[]> {
    if (USE_MOCK) return mockDelay(mockTripHistory);
    const { data } = await api.get(endpoints.rider.trips);
    return data;
  },
};
