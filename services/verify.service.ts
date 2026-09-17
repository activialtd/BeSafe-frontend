import { Driver, Vehicle } from "@/types";
import { api } from "./api";
import { endpoints } from "./endpoints";

export interface RideVerificationResult {
  ok: boolean;
  driver?: Driver;
  vehicle?: Vehicle;
  warnings?: string[];
  reason?: string;
}

const unwrap = (res: any) => res.data?.data || res.data;

export const verifyService = {
  async byQr(qrToken: string): Promise<RideVerificationResult> {
    // If the scanner picks up a JSON string, extract the token
    let token = qrToken;
    try {
      const parsed = JSON.parse(qrToken);
      if (parsed?.token) token = parsed.token;
    } catch {
      /* use raw token */
    }

    const { data } = await api.post(endpoints.verify.byQr, { qrToken: token });
    return unwrap(data);
  },

  async byPlate(plate: string): Promise<RideVerificationResult> {
    const { data } = await api.post(endpoints.verify.byPlate, { plate });
    return unwrap(data);
  },
};
