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
    const { data } = await api.get(endpoints.driver.me);
    return unwrap(data);
  },

  async verifyLicense(
    licenseNumber: string,
    dateOfBirth?: string,
  ): Promise<{ ok: boolean; fullName: string }> {
    const { data } = await api.post(endpoints.driver.verifyLicense, {
      licenseNumber,
      dateOfBirth,
    });
    return unwrap(data);
  },

  async registerVehicle(payload: RegisterVehiclePayload): Promise<Vehicle> {
    const { data } = await api.post(endpoints.driver.vehicles, payload);
    return unwrap(data);
  },

  async setOnline(online: boolean): Promise<{ online: boolean }> {
    const { data } = await api.put(endpoints.driver.online, { online });
    return unwrap(data);
  },
};
