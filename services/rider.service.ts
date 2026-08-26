import { mockEmergencyContacts } from '@/data/mockData';
import { EmergencyContact } from '@/types';
import { api, mockDelay, USE_MOCK } from './api';
import { endpoints } from './endpoints';

export const riderService = {
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    if (USE_MOCK) return mockDelay(mockEmergencyContacts);
    const { data } = await api.get(endpoints.rider.emergencyContacts);
    return data;
  },

  async addEmergencyContact(payload: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    if (USE_MOCK) {
      const c: EmergencyContact = { id: 'ec_' + Date.now(), ...payload };
      mockEmergencyContacts.push(c);
      return mockDelay(c, 300);
    }
    const { data } = await api.post(endpoints.rider.emergencyContacts, payload);
    return data;
  },

  async removeEmergencyContact(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = mockEmergencyContacts.findIndex(c => c.id === id);
      if (idx > -1) mockEmergencyContacts.splice(idx, 1);
      return mockDelay(undefined, 200);
    }
    await api.delete(`${endpoints.rider.emergencyContacts}/${id}`);
  },
};
