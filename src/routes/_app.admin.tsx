import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle2, Clock, XCircle, Smartphone, Wifi } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { adminStats, weeklyTrend, liveConnections } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin · SmartAttend" }] }),
  component: AdminPage,
});

const departmentBreakdown = [
  { dept: "CS", present: 142, absent: 18 },
  { dept: "EE", present: 128, absent: 22 },
  { dept: "ME", present: 154, absent: 16 },
  { dept: "CE", present: 118, absent: 28 },
  { dept: "IT", present: 138, absent: 14 },
  { dept: "BT", present: 96, absent: 30 },
];

function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Console"
        description="Real-time monitoring across users, devices, and authorized networks."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={adminStats.totalUsers} icon={Users} tone="primary" />
        <StatCard label="Present Today" value={adminStats.presentToday} icon={CheckCircle2} tone="success" />
        <StatCard label="Late Today" value={adminStats.lateToday} icon={Clock} tone="warning" />
        <StatCard label="Absent Today" value={adminStats.absentToday} icon={XCircle} tone="destructive" />
        <StatCard label="Active Devices" value={adminStats.activeDevices} icon={Smartphone} tone="accent" />
        <StatCard label="Authorized Networks" value={adminStats.authorizedNetworks} icon={Wifi} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-surface border-border/60 p-5">
          <h3 className="font-semibold mb-4">Attendance by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="dept" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="present" fill="var(--success)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="absent" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-surface border-border/60 p-5">
          <h3 className="font-semibold mb-4">Network Status</h3>
          <div className="space-y-3 text-sm">
            {[
              { ssid: "CampusNet_Secure", loc: "Block A", users: 482, status: "Online" },
              { ssid: "Library_Net", loc: "Library", users: 214, status: "Online" },
              { ssid: "Lab_Net_2", loc: "Block C", users: 168, status: "Online" },
              { ssid: "Auditorium_WiFi", loc: "Auditorium", users: 252, status: "Online" },
            ].map((n) => (
              <div key={n.ssid} className="rounded-lg border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{n.ssid}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> {n.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{n.loc} · {n.users} users</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-surface border-border/60 p-5">
        <h3 className="font-semibold mb-4">Live Activity Feed</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-3 font-medium">User</th>
                <th className="py-3 font-medium">ID</th>
                <th className="py-3 font-medium">Device</th>
                <th className="py-3 font-medium">Check-in</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {liveConnections.map((c) => (
                <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/40">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td className="py-3 text-muted-foreground">{c.id}</td>
                  <td className="py-3 text-muted-foreground">{c.device}</td>
                  <td className="py-3 text-muted-foreground">{c.time}</td>
                  <td className="py-3"><StatusPill status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
