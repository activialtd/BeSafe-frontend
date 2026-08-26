import { mockEmergencyContacts } from '@/data/mockData';
import { Location, SosEvent, SosType } from '@/types';
import { api, mockDelay, USE_MOCK } from './api';
import { endpoints } from './endpoints';

export const sosService = {
  async trigger(params: {
    location: Location;
    rideId?: string;
    type?: SosType;
  }): Promise<SosEvent> {
    const { location, rideId, type = 'panic' } = params;
    if (USE_MOCK) {
      const event: SosEvent = {
        id: 'sos_' + Date.now(),
        userId: 'user_r_001',
        rideId,
        type,
        status: 'active',
        triggeredAt: new Date().toISOString(),
        location,
        notifiedContacts: mockEmergencyContacts.map(c => c.id),
        notifiedAuthorities: ['LASEMA', 'RRS-Lagos', 'NPF-112'],
        responseEtaSec: 480, // 8 min
      };
      return mockDelay(event, 700);
    }
    const { data } = await api.post(endpoints.sos.trigger, { rideId, type, ...location });
    return data;
  },

  async cancel(sosId: string, pin: string): Promise<{ ok: boolean }> {
    if (USE_MOCK) {
      if (pin !== '1234') throw new Error('Incorrect safety PIN');
      return mockDelay({ ok: true }, 400);
    }
    const { data } = await api.post(endpoints.sos.cancel(sosId), { pin });
    return data;
  },

  async silentTrigger(location: Location): Promise<SosEvent> {
    if (USE_MOCK) return this.trigger({ location, type: 'silent' });
    const { data } = await api.post(endpoints.sos.silentTrigger, location);
    return data;
  },
};
