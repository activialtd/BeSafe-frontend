import { mockDriverAccount, mockRider } from '@/data/mockData';
import { User, UserRole } from '@/types';
import { api, mockDelay, tokenStore, USE_MOCK } from './api';
import { endpoints } from './endpoints';

export const authService = {
  async requestOtp(phone: string): Promise<{ requestId: string }> {
    if (USE_MOCK) return mockDelay({ requestId: 'req_' + Date.now() });
    const { data } = await api.post(endpoints.auth.requestOtp, { phone });
    return data;
  },

  async verifyOtp(phone: string, code: string): Promise<{ tempToken: string }> {
    if (USE_MOCK) {
      if (code !== '000000' && code.length !== 6) throw new Error('Invalid code');
      return mockDelay({ tempToken: 'tmp_' + Date.now() });
    }
    const { data } = await api.post(endpoints.auth.verifyOtp, { phone, code });
    return data;
  },

  async verifyNin(nin: string, dob?: string): Promise<{ verified: boolean; fullName: string }> {
    if (USE_MOCK) {
      if (nin.length !== 11) throw new Error('NIN must be 11 digits');
      return mockDelay({ verified: true, fullName: 'Adaeze Okonkwo' }, 1400);
    }
    const { data } = await api.post(endpoints.auth.verifyNin, { nin, dob });
    return data;
  },

  async setRole(role: UserRole): Promise<User> {
    if (USE_MOCK) {
      const user = role === 'driver' ? mockDriverAccount : mockRider;
      await tokenStore.set('mock.access.' + Date.now(), 'mock.refresh.' + Date.now());
      return mockDelay(user, 400);
    }
    const { data } = await api.post(endpoints.auth.setRole, { role });
    return data;
  },

  async me(): Promise<User | null> {
    if (USE_MOCK) {
      const token = await tokenStore.get();
      if (!token) return null;
      // In mock we can't tell which role was chosen after restart, default to rider
      return mockDelay(mockRider);
    }
    try {
      const { data } = await api.get(endpoints.auth.me);
      return data;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await tokenStore.clear();
      return mockDelay(undefined, 200);
    }
    try {
      await api.post(endpoints.auth.logout);
    } finally {
      await tokenStore.clear();
    }
  },
};
