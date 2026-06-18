import { api } from "./client";

export interface DeviceRecord {
  id: number;
  deviceName: string;
  macAddress: string;
  deviceType: string | null;
  primary: boolean;
  verified: boolean;
  registeredAt: string;
}

export interface RegisterDevicePayload {
  deviceName: string;
  macAddress: string;
  deviceType?: string;
  primary?: boolean;
}

export const deviceApi = {
  mine: () => api<DeviceRecord[]>("/devices/me"),
  register: (req: RegisterDevicePayload) =>
    api<DeviceRecord>("/devices/me", { method: "POST", body: JSON.stringify(req) }),
  remove: (id: number) => api<void>(`/devices/me/${id}`, { method: "DELETE" }),
  verify: (id: number) => api<DeviceRecord>(`/devices/${id}/verify`, { method: "POST" }),
};
