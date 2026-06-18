import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wifi, Smartphone, CheckCircle2, Loader2, ShieldCheck, Clock, AlertCircle, LogOut } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { wifiNetwork } from "@/lib/mock-data";
import { toast } from "sonner";
import { attendanceApi, type AttendanceRecord } from "@/lib/api/attendance";
import { deviceApi } from "@/lib/api/device";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Mark Attendance · SmartAttend" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const qc = useQueryClient();

  const devicesQuery = useQuery({ queryKey: ["devices", "me"], queryFn: () => deviceApi.mine() });
  const historyQuery = useQuery({
    queryKey: ["attendance", "me"],
    queryFn: () => attendanceApi.myHistory(),
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord: AttendanceRecord | undefined = historyQuery.data?.find((r) => r.attendanceDate === today);

  const primaryDevice = devicesQuery.data?.find((d) => d.primary) ?? devicesQuery.data?.[0];

  const checkInMut = useMutation({
    mutationFn: () => {
      if (!primaryDevice) throw new Error("Register a device first.");
      return attendanceApi.checkIn({
        macAddress: primaryDevice.macAddress,
        wifiSsid: wifiNetwork.ssid,
      });
    },
    onSuccess: (rec) => {
      toast.success("Attendance marked", { description: `Status: ${rec.status} via ${rec.wifiSsid ?? "Wi-Fi"}` });
      qc.invalidateQueries({ queryKey: ["attendance"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof ApiError ? e.message : (e as Error).message;
      toast.error("Check-in failed", { description: msg });
    },
  });

  const checkOutMut = useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      toast.success("Checked out");
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof ApiError ? e.message : (e as Error).message;
      toast.error("Check-out failed", { description: msg });
    },
  });

  const marked = !!todayRecord;
  const verifying = checkInMut.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        description="Attendance is verified through Wi-Fi network and your registered device."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-surface border-border/60 p-6 shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Status for today</p>
            <div className="mt-3 flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${marked ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                {marked ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {historyQuery.isLoading ? "Loading…" : marked ? todayRecord!.status : "Not marked yet"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {marked && todayRecord?.checkIn
                    ? `Check-in ${new Date(todayRecord.checkIn).toLocaleTimeString()}`
                    : "Connect to authorized Wi-Fi and tap below."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Check label="Wi-Fi network" value={wifiNetwork.ssid} ok />
              <Check label="Primary device" value={primaryDevice?.deviceName ?? "—"} ok={!!primaryDevice} />
              <Check label="Device MAC" value={primaryDevice?.macAddress ?? "Register a device"} ok={!!primaryDevice} />
            </div>

            {!primaryDevice && !devicesQuery.isLoading && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                You need to register a device before marking attendance.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={() => checkInMut.mutate()}
                disabled={verifying || !primaryDevice}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {verifying ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying device & network…</>
                ) : (
                  <>{marked ? "Re-verify" : "Mark attendance now"}</>
                )}
              </Button>
              {marked && !todayRecord?.checkOut && (
                <Button variant="outline" onClick={() => checkOutMut.mutate()} disabled={checkOutMut.isPending}>
                  {checkOutMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                  Check out
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-surface border-border/60 p-5">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Connected Network</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Row k="SSID" v={wifiNetwork.ssid} />
            <Row k="Band" v={wifiNetwork.band} />
            <Row k="Signal" v={`${wifiNetwork.signal}%`} />
            <Row k="Building" v={wifiNetwork.building} />
            <Row k="Authorized" v="Yes" ok />
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-surface border-border/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Your Registered Devices</h3>
        </div>
        {devicesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading devices…</p>}
        {devicesQuery.data && devicesQuery.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No devices yet — register one on the Devices page.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {devicesQuery.data?.map((d) => (
            <div key={d.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{d.deviceName}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] ${d.verified ? "text-success" : "text-muted-foreground"}`}>
                  <ShieldCheck className="h-3 w-3" /> {d.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d.deviceType ?? "Device"} · {d.macAddress}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Check({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {ok && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function Row({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-medium ${ok ? "text-success" : ""}`}>{v}</span>
    </div>
  );
}
