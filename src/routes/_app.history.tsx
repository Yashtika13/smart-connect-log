import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { attendanceHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "History · SmartAttend" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [q, setQ] = useState("");
  const rows = attendanceHistory.filter(r =>
    !q || r.date.includes(q) || r.status.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance History"
        description="Every check-in, verified by Wi-Fi and device."
        actions={
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
        }
      />

      <Card className="bg-gradient-surface border-border/60 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by date or status…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Stat label="Present" value={attendanceHistory.filter(r => r.status === "Present").length} />
            <Stat label="Late" value={attendanceHistory.filter(r => r.status === "Late").length} />
            <Stat label="Absent" value={attendanceHistory.filter(r => r.status === "Absent").length} />
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Check-in</th>
                <th className="py-3 font-medium">Check-out</th>
                <th className="py-3 font-medium">Device</th>
                <th className="py-3 font-medium">Network</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 font-medium">{r.date}</td>
                  <td className="py-3"><StatusPill status={r.status} /></td>
                  <td className="py-3 text-muted-foreground">{r.checkIn}</td>
                  <td className="py-3 text-muted-foreground">{r.checkOut}</td>
                  <td className="py-3 text-muted-foreground">{r.device}</td>
                  <td className="py-3 text-muted-foreground">{r.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-1.5">
      <span className="text-foreground font-semibold">{value}</span> {label}
    </div>
  );
}
