import { Location, SosEvent, SosType } from "@/types";
import { api } from "./api";
import { endpoints } from "./endpoints";

const unwrap = (res: any) => res.data?.data || res.data;

export const sosService = {
  async trigger(params: {
    location: Location;
    rideId?: string;
    type?: SosType;
  }): Promise<SosEvent> {
    const res = await api.post(endpoints.sos.trigger, {
      lat: params.location.lat,
      lng: params.location.lng,
      rideId: params.rideId,
      type: params.type || "panic",
    });
    return unwrap(res);
  },

  async cancel(sosId: string, pin: string): Promise<{ cancelled: boolean }> {
    const res = await api.post(endpoints.sos.cancel(sosId), { pin });
    return unwrap(res);
  },
};
