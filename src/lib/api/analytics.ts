import { api } from "./client";

export interface DailyPoint {
  date: string;
  total: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalFaculty: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  attendanceRate: number;
  last7Days: DailyPoint[];
  presentByDepartment: Record<string, number>;
}

export const analyticsApi = {
  dashboard: () => api<DashboardStats>("/analytics/dashboard"),
};
