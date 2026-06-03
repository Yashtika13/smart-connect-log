export const currentUser = {
  name: "Aarav Sharma",
  id: "STU-2024-0173",
  role: "Student",
  email: "aarav.sharma@university.edu",
  department: "Computer Science",
  year: "3rd Year",
  avatar: "AS",
};

export const wifiNetwork = {
  ssid: "CampusNet_Secure",
  band: "5 GHz",
  signal: 92,
  authorized: true,
  password: "C@mpus2024!Secure",
  building: "Engineering Block A",
  status: "Connected",
};

export const registeredDevices = [
  { id: "D-001", name: "iPhone 15 Pro", mac: "A4:83:E7:91:2C:D5", type: "Mobile", lastSeen: "Just now", active: true },
  { id: "D-002", name: "MacBook Air M2", mac: "F0:18:98:4D:1A:7B", type: "Laptop", lastSeen: "2 hours ago", active: true },
  { id: "D-003", name: "iPad Mini", mac: "8C:85:90:22:11:09", type: "Tablet", lastSeen: "3 days ago", active: false },
];

export const todayStatus = {
  marked: true,
  time: "09:12 AM",
  method: "Wi-Fi Auto",
  device: "iPhone 15 Pro",
  network: "CampusNet_Secure",
  status: "Present",
};

export const attendanceHistory = [
  { date: "2026-06-02", status: "Present", checkIn: "09:08 AM", checkOut: "04:32 PM", device: "iPhone 15 Pro", network: "CampusNet_Secure" },
  { date: "2026-06-01", status: "Present", checkIn: "09:14 AM", checkOut: "04:28 PM", device: "MacBook Air M2", network: "CampusNet_Secure" },
  { date: "2026-05-31", status: "Late", checkIn: "10:02 AM", checkOut: "04:45 PM", device: "iPhone 15 Pro", network: "CampusNet_Secure" },
  { date: "2026-05-30", status: "Absent", checkIn: "—", checkOut: "—", device: "—", network: "—" },
  { date: "2026-05-29", status: "Present", checkIn: "08:58 AM", checkOut: "05:01 PM", device: "iPhone 15 Pro", network: "CampusNet_Secure" },
  { date: "2026-05-28", status: "Present", checkIn: "09:05 AM", checkOut: "04:36 PM", device: "MacBook Air M2", network: "CampusNet_Secure" },
  { date: "2026-05-27", status: "Leave", checkIn: "—", checkOut: "—", device: "—", network: "—" },
  { date: "2026-05-26", status: "Present", checkIn: "09:11 AM", checkOut: "04:55 PM", device: "iPhone 15 Pro", network: "CampusNet_Secure" },
];

export const weeklyTrend = [
  { day: "Mon", present: 42, absent: 6, late: 4 },
  { day: "Tue", present: 45, absent: 4, late: 3 },
  { day: "Wed", present: 40, absent: 8, late: 4 },
  { day: "Thu", present: 47, absent: 3, late: 2 },
  { day: "Fri", present: 38, absent: 10, late: 4 },
  { day: "Sat", present: 30, absent: 18, late: 4 },
];

export const monthlyTrend = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  rate: 78 + Math.round(Math.sin(i) * 8 + 10),
}));

export const distribution = [
  { name: "Present", value: 76, color: "var(--success)" },
  { name: "Late", value: 12, color: "var(--warning)" },
  { name: "Absent", value: 8, color: "var(--destructive)" },
  { name: "On Leave", value: 4, color: "var(--accent)" },
];

export const liveConnections = [
  { name: "Aarav Sharma", id: "STU-2024-0173", device: "iPhone 15 Pro", time: "09:12 AM", status: "Present" },
  { name: "Priya Verma", id: "STU-2024-0189", device: "Pixel 9", time: "09:14 AM", status: "Present" },
  { name: "Rohan Iyer", id: "STU-2024-0201", device: "MacBook Pro", time: "09:18 AM", status: "Present" },
  { name: "Sneha Kapoor", id: "STU-2024-0156", device: "Galaxy S24", time: "10:04 AM", status: "Late" },
  { name: "Vikram Singh", id: "STU-2024-0212", device: "iPad Air", time: "09:07 AM", status: "Present" },
  { name: "Anjali Mehta", id: "STU-2024-0143", device: "OnePlus 12", time: "09:21 AM", status: "Present" },
];

export const leaveRequests = [
  { id: "LV-2026-041", from: "2026-06-10", to: "2026-06-12", reason: "Family wedding", status: "Pending", appliedOn: "2026-05-30" },
  { id: "LV-2026-029", from: "2026-05-15", to: "2026-05-15", reason: "Medical appointment", status: "Approved", appliedOn: "2026-05-12" },
  { id: "LV-2026-018", from: "2026-04-22", to: "2026-04-24", reason: "Conference attendance", status: "Approved", appliedOn: "2026-04-15" },
  { id: "LV-2026-009", from: "2026-03-08", to: "2026-03-08", reason: "Personal", status: "Rejected", appliedOn: "2026-03-07" },
];

export const adminStats = {
  totalUsers: 1248,
  presentToday: 1042,
  absentToday: 138,
  lateToday: 68,
  activeDevices: 1116,
  authorizedNetworks: 4,
};
