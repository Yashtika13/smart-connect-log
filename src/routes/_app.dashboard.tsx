import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, CheckCircle2, Clock, XCircle, Activity, Wifi } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  adminStats, weeklyTrend, monthlyTrend, distribution, liveConnections, todayStatus, wifiNetwork,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SmartAttend" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live attendance, network status, and analytics at a glance."
        actions={
          <Link to="/attendance">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Mark attendance
            </Button>
          </Link>
        }
      />

      {/* Today's status banner */}
      <Card className="bg-gradient-surface border-border/60 p-5 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Today's Attendance</p>
              <p className="text-xl font-semibold">Marked Present at {todayStatus.time}</p>
              <p className="text-sm text-muted-foreground">
                via {todayStatus.device} · {todayStatus.network}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-secondary/60 border border-border px-4 py-3">
            <Wifi className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Connected to</p>
              <p className="text-sm font-medium">{wifiNetwork.ssid} · {wifiNetwork.signal}%</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={adminStats.totalUsers} delta="↑ 24 this week" icon={Users} tone="primary" />
        <StatCard label="Present Today" value={adminStats.presentToday} delta="83.5% of users" icon={CheckCircle2} tone="success" />
        <StatCard label="Late Arrivals" value={adminStats.lateToday} delta="↓ 12 vs yesterday" icon={Clock} tone="warning" />
        <StatCard label="Absent" value={adminStats.absentToday} delta="11.1% of users" icon={XCircle} tone="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-surface border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Weekly Attendance</h3>
              <p className="text-xs text-muted-foreground">Present, late, and absent by day</p>
            </div>
            <span className="text-xs text-muted-foreground">Last 6 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="present" stackId="a" fill="var(--success)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="late" stackId="a" fill="var(--warning)" />
              <Bar dataKey="absent" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-surface border-border/60 p-5">
          <h3 className="font-semibold">Status Distribution</h3>
          <p className="text-xs text-muted-foreground">This month</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={distribution} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {distribution.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-surface border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Monthly Attendance Rate</h3>
              <p className="text-xs text-muted-foreground">Percentage across the year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={2} fill="url(#rateGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-surface border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Live Connections</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <Activity className="h-3.5 w-3.5" />
              {liveConnections.length} active
            </span>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {liveConnections.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.device} · {c.time}</p>
                </div>
                <StatusPill status={c.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
