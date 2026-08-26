import { mockDriverAccount } from '@/data/mockData';
import { Driver, Vehicle, VehicleType } from '@/types';
import { api, mockDelay, USE_MOCK } from './api';
import { endpoints } from './endpoints';

export interface RegisterVehiclePayload {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vin?: string;
  photos?: string[];
}

export const driverService = {
  async getProfile(): Promise<Driver> {
    if (USE_MOCK) return mockDelay(mockDriverAccount);
    const { data } = await api.get(endpoints.driver.profile);
    return data;
  },

  async registerVehicle(payload: RegisterVehiclePayload): Promise<Vehicle> {
    if (USE_MOCK) {
      const vehicle: Vehicle = {
        id: 'veh_' + Date.now(),
        ownerId: mockDriverAccount.id,
        type: payload.type,
        brand: payload.brand,
        model: payload.model,
        year: payload.year,
        color: payload.color,
        plateNumber: payload.plateNumber.toUpperCase(),
        vin: payload.vin,
        photos: payload.photos ?? [],
        qrToken: `BSF.VEH.veh_${Date.now()}.${Math.random().toString(16).slice(2, 14)}`,
        registrationStatus: 'verified',
        registeredAt: new Date().toISOString(),
      };
      // In real state we'd push to store; here we mutate mock for the session
      mockDriverAccount.vehicles.push(vehicle);
      return mockDelay(vehicle, 1200);
    }
    const { data } = await api.post(endpoints.driver.registerVehicle, payload);
    return data;
  },

  async setOnline(online: boolean): Promise<{ isOnline: boolean }> {
    if (USE_MOCK) {
      mockDriverAccount.isOnline = online;
      return mockDelay({ isOnline: online }, 250);
    }
    const path = online ? endpoints.driver.goOnline : endpoints.driver.goOffline;
    const { data } = await api.post(path);
    return data;
  },
};
