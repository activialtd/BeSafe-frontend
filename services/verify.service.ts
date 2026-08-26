import { mockNearbyDrivers } from '@/data/mockData';
import { Driver, Vehicle } from '@/types';
import { api, mockDelay, USE_MOCK } from './api';
import { endpoints } from './endpoints';

export interface RideVerificationResult {
  ok: boolean;
  driver: Driver;
  vehicle: Vehicle;
  warnings?: string[];
}

export const verifyService = {
  async byQr(qrToken: string): Promise<RideVerificationResult> {
    if (USE_MOCK) {
      // Parse the QR payload: it may be a JSON string or the raw token.
      let token = qrToken;
      try {
        const parsed = JSON.parse(qrToken);
        if (parsed?.token) token = parsed.token;
      } catch { /* raw token */ }

      // Try to find by embedded id from the token pattern BSF.VEH.<id>.<hex>
      const idMatch = token.match(/BSF\.VEH\.([^.]+)\./);
      const vehicleId = idMatch?.[1];

      let driver = mockNearbyDrivers.find(d => d.vehicles[0].id === vehicleId);
      if (!driver) driver = mockNearbyDrivers[0]; // demo fallback

      return mockDelay({
        ok: true,
        driver,
        vehicle: driver.vehicles[0],
        warnings: driver.rating < 4.5 ? ['Driver has a rating below 4.5'] : [],
      }, 900);
    }
    const { data } = await api.post(endpoints.verify.byQr, { qrToken });
    return data;
  },

  async byPlate(plate: string): Promise<RideVerificationResult> {
    if (USE_MOCK) {
      const normalized = plate.replace(/\s+/g, '').toUpperCase();
      const driver = mockNearbyDrivers.find(d =>
        d.vehicles[0].plateNumber.replace(/[-\s]/g, '').toUpperCase() === normalized.replace(/-/g, '')
      );
      if (!driver) {
        return mockDelay({
          ok: false,
          driver: mockNearbyDrivers[0],
          vehicle: mockNearbyDrivers[0].vehicles[0],
          warnings: ['This plate number is NOT registered on BeSafe. Do NOT enter this vehicle.'],
        }, 900);
      }
      return mockDelay({ ok: true, driver, vehicle: driver.vehicles[0] }, 900);
    }
    const { data } = await api.post(endpoints.verify.byPlate, { plate });
    return data;
  },
};
