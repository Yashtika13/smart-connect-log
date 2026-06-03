import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, FileBarChart, TrendingUp, Calendar } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { weeklyTrend, monthlyTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports · SmartAttend" }] }),
  component: ReportsPage,
});

const dailyHourly = Array.from({ length: 9 }).map((_, i) => ({
  hour: `${8 + i}:00`,
  checkins: Math.max(0, Math.round(40 * Math.exp(-Math.pow((i - 1.5) / 1.4, 2)))),
}));

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Graphical reports across daily, weekly, and monthly windows."
        actions={
          <>
            <Button variant="outline" size="sm"><Calendar className="mr-1.5 h-4 w-4" /> Date range</Button>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Download className="mr-1.5 h-4 w-4" /> Download PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Summary icon={TrendingUp} label="Avg. attendance" value="87.4%" sub="↑ 3.2% vs last month" />
        <Summary icon={FileBarChart} label="Reports generated" value="142" sub="Last 30 days" />
        <Summary icon={Calendar} label="Active period" value="May–Jun" sub="Spring semester" />
      </div>

      <Card className="bg-gradient-surface border-border/60 p-5">
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-5">
            <h3 className="font-semibold mb-1">Check-ins by hour</h3>
            <p className="text-xs text-muted-foreground mb-4">Today · across all departments</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="checkins" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-5">
            <h3 className="font-semibold mb-1">Weekly breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">Present, late, and absent across the week</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="present" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="mt-5">
            <h3 className="font-semibold mb-1">Monthly attendance rate</h3>
            <p className="text-xs text-muted-foreground mb-4">Full year trend</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function Summary({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <Card className="bg-gradient-surface border-border/60 p-5 flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </Card>
  );
}
