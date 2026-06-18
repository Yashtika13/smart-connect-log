import { api } from "./client";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRecord {
  id: number;
  userId: number;
  fullName: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  createdAt: string;
}

export interface LeaveRequestPayload {
  startDate: string;
  endDate: string;
  reason?: string;
}

export const leaveApi = {
  create: (req: LeaveRequestPayload) =>
    api<LeaveRecord>("/leaves", { method: "POST", body: JSON.stringify(req) }),
  mine: () => api<LeaveRecord[]>("/leaves/me"),
  pending: () => api<LeaveRecord[]>("/leaves/pending"),
  decide: (id: number, status: "APPROVED" | "REJECTED") =>
    api<LeaveRecord>(`/leaves/${id}/decision`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
