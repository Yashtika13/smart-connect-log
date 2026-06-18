import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Loader2, AlertCircle } from "lucide-react";
import { attendanceApi, type AttendanceRecord } from "@/lib/api/attendance";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "History · SmartAttend" }] }),
  component: HistoryPage,
});

function fmtTime(s: string | null) {
  return s ? new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
}

function HistoryPage() {
  const [q, setQ] = useState("");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["attendance", "me"],
    queryFn: () => attendanceApi.myHistory(),
  });

  const rows = useMemo(() => {
    if (!data) return [] as AttendanceRecord[];
    return data.filter(
      (r) => !q || r.attendanceDate.includes(q) || r.status.toLowerCase().includes(q.toLowerCase()),
    );
  }, [data, q]);

  const counts = useMemo(() => {
    return {
      present: data?.filter((r) => r.status === "PRESENT").length ?? 0,
      late: data?.filter((r) => r.status === "LATE").length ?? 0,
      absent: data?.filter((r) => r.status === "ABSENT").length ?? 0,
    };
  }, [data]);

  function exportCsv() {
    if (!data) return;
    const header = "Date,Status,Check-in,Check-out,Device,Network\n";
    const body = data
      .map((r) =>
        [r.attendanceDate, r.status, r.checkIn ?? "", r.checkOut ?? "", r.deviceName ?? "", r.wifiSsid ?? ""].join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance History"
        description="Every check-in, verified by Wi-Fi and device."
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data?.length}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Card className="bg-gradient-surface border-border/60 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by date or status…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Stat label="Present" value={counts.present} />
            <Stat label="Late" value={counts.late} />
            <Stat label="Absent" value={counts.absent} />
          </div>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading history…</p>
        )}
        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>
              <p>{(error as Error).message}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        )}

        {data && (
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
                  <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 font-medium">{r.attendanceDate}</td>
                    <td className="py-3"><StatusPill status={titleCase(r.status)} /></td>
                    <td className="py-3 text-muted-foreground">{fmtTime(r.checkIn)}</td>
                    <td className="py-3 text-muted-foreground">{fmtTime(r.checkOut)}</td>
                    <td className="py-3 text-muted-foreground">{r.deviceName ?? "—"}</td>
                    <td className="py-3 text-muted-foreground">{r.wifiSsid ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground text-sm">No records.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function titleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ");
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-1.5">
      <span className="text-foreground font-semibold">{value}</span> {label}
    </div>
  );
}
