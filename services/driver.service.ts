import { Driver, Vehicle, VehicleType } from "@/types";
import { api } from "./api";
import { endpoints } from "./endpoints";

export interface RegisterVehiclePayload {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  photos?: string[];
}

const unwrap = (res: any) => res.data?.data || res.data;

export const driverService = {
  async getProfile(): Promise<Driver> {
    const res = await api.get(endpoints.driver.me);
    return unwrap(res);
  },

  async verifyLicense(
    licenseNumber: string,
    dateOfBirth?: string,
  ): Promise<{ ok: boolean; fullName: string }> {
    const res = await api.post(endpoints.driver.verifyLicense, {
      licenseNumber,
      dateOfBirth,
    });
    return unwrap(res);
  },

  async verifyPlate(plateNumber: string): Promise<{ details: any }> {
    const res = await api.post(endpoints.driver.verifyPlateNumber, {
      plateNumber,
    });
    return unwrap(res);
  },

  async registerVehicle(payload: RegisterVehiclePayload): Promise<Vehicle> {
    const res = await api.post(endpoints.driver.vehicles, payload);
    return unwrap(res);
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    const res = await api.delete(endpoints.driver.removeVehicle(vehicleId));
    return unwrap(res);
  },

  async setOnline(online: boolean): Promise<{ online: boolean }> {
    const res = await api.put(endpoints.driver.online, { online });
    return unwrap(res);
  },
};
