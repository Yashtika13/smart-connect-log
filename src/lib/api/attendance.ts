import { api } from "./client";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";

export interface AttendanceRecord {
  id: number;
  userId: number;
  fullName: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  wifiSsid: string | null;
  wifiBssid: string | null;
  status: AttendanceStatus;
  deviceName: string | null;
}

export interface CheckInRequest {
  macAddress: string;
  wifiSsid: string;
  wifiBssid?: string;
}

export const attendanceApi = {
  checkIn: (req: CheckInRequest) =>
    api<AttendanceRecord>("/attendance/check-in", { method: "POST", body: JSON.stringify(req) }),
  checkOut: () => api<AttendanceRecord>("/attendance/check-out", { method: "POST" }),
  myHistory: () => api<AttendanceRecord[]>("/attendance/me"),
  byDate: (date: string) => api<AttendanceRecord[]>(`/attendance/by-date?date=${date}`),
};
