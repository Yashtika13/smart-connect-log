import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle2, Clock, XCircle, Activity, Wifi, Loader2, AlertCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsApi } from "@/lib/api/analytics";
import { wifiNetwork } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SmartAttend" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => analyticsApi.dashboard(),
    refetchInterval: 30_000,
  });

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

      {isLoading && (
        <Card className="p-6 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading live analytics…
        </Card>
      )}

      {error && (
        <Card className="p-6 border-destructive/40 bg-destructive/5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">Unable to load analytics</p>
            <p className="text-xs text-muted-foreground mt-1">{(error as Error).message}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {data && (
        <>
          <Card className="bg-gradient-surface border-border/60 p-5 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Attendance Rate</p>
                  <p className="text-xl font-semibold">{data.attendanceRate.toFixed(1)}% today</p>
                  <p className="text-sm text-muted-foreground">
                    {data.presentToday} present · {data.lateToday} late · {data.absentToday} absent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-secondary/60 border border-border px-4 py-3">
                <Wifi className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Authorized network</p>
                  <p className="text-sm font-medium">{wifiNetwork.ssid}</p>
                </div>
              </div>
            </div>
            {isFetching && (
              <p className="relative mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" /> refreshing…
              </p>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={data.totalUsers} delta={`${data.totalStudents} students`} icon={Users} tone="primary" />
            <StatCard label="Present Today" value={data.presentToday} delta={`${data.attendanceRate.toFixed(1)}% rate`} icon={CheckCircle2} tone="success" />
            <StatCard label="Late Arrivals" value={data.lateToday} delta="today" icon={Clock} tone="warning" />
            <StatCard label="Absent" value={data.absentToday} delta="today" icon={XCircle} tone="destructive" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 bg-gradient-surface border-border/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Last 7 Days</h3>
                  <p className="text-xs text-muted-foreground">Total attendance records per day</p>
                </div>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> live
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-gradient-surface border-border/60 p-5">
              <h3 className="font-semibold">By Department (Today)</h3>
              <p className="text-xs text-muted-foreground mb-2">Present count</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={Object.entries(data.presentByDepartment).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {Object.keys(data.presentByDepartment).map((_, i) => (
                      <Cell key={i} fill={["var(--primary)", "var(--success)", "var(--warning)", "var(--accent)", "var(--destructive)"][i % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {Object.entries(data.presentByDepartment).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <span>{name}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                {Object.keys(data.presentByDepartment).length === 0 && (
                  <p className="text-xs text-muted-foreground">No data yet.</p>
                )}
              </div>
            </Card>
          </div>

          <Card className="bg-gradient-surface border-border/60 p-5">
            <h3 className="font-semibold mb-3">Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.last7Days}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} fill="url(#rateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
