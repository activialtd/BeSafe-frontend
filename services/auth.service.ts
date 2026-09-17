import { User, UserRole } from "@/types";
import { api, tokenStore } from "./api";
import { endpoints } from "./endpoints";

// Helper to safely unwrap the NestJS global response envelope
const unwrap = (res: any) => res.data?.data || res.data;

export const authService = {
  async requestOtp(
    phone: string,
    purpose: "login" | "verify_phone" = "login",
  ): Promise<{ sent: boolean; expiresAt: string }> {
    const res = await api.post(endpoints.auth.requestOtp, { phone, purpose });
    return unwrap(res);
  },

  async verifyOtp(phone: string, code: string): Promise<{ user: User }> {
    const res = await api.post(endpoints.auth.verifyOtp, { phone, code });
    const payload = unwrap(res);

    if (payload?.accessToken && payload?.refreshToken) {
      await tokenStore.set(payload.accessToken, payload.refreshToken);
    }

    return payload;
  },

  async setRole(role: UserRole, fullName: string): Promise<{ user: User }> {
    const res = await api.post(endpoints.auth.setRole, { role, fullName });
    const payload = unwrap(res);

    if (payload?.accessToken && payload?.refreshToken) {
      await tokenStore.set(payload.accessToken, payload.refreshToken);
    }

    return payload;
  },

  async verifyNin(
    nin: string,
    dob?: string,
  ): Promise<{ verified: boolean; fullName: string }> {
    const res = await api.post(endpoints.auth.verifyNin, {
      nin,
      dateOfBirth: dob,
    });
    return unwrap(res);
  },

  async setSosPin(pin: string): Promise<{ set: boolean }> {
    const res = await api.post(endpoints.auth.setSosPin, { pin });
    return unwrap(res);
  },

  async me(): Promise<User | null> {
    try {
      const res = await api.get(endpoints.auth.me);
      return unwrap(res);
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = await tokenStore.getRefresh();
    if (refreshToken) {
      try {
        await api.post(endpoints.auth.logout, { refreshToken });
      } catch {}
    }
    await tokenStore.clear();
  },
};
