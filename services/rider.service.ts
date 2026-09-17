import { EmergencyContact } from "@/types";
import { api } from "./api";
import { endpoints } from "./endpoints";

const unwrap = (res: any) => res.data?.data || res.data;

export const riderService = {
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const res = await api.get(endpoints.rider?.contacts || "/rider/contacts");
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async addEmergencyContact(payload: {
    name: string;
    phone: string;
    relationship: string;
  }): Promise<EmergencyContact> {
    const res = await api.post(
      endpoints.rider?.contacts || "/rider/contacts",
      payload,
    );
    return unwrap(res);
  },

  async removeEmergencyContact(id: string): Promise<void> {
    await api.delete(`${endpoints.rider?.contacts || "/rider/contacts"}/${id}`);
  },
};
