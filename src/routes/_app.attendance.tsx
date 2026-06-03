import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wifi, Smartphone, CheckCircle2, Loader2, ShieldCheck, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { wifiNetwork, todayStatus, registeredDevices } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Mark Attendance · SmartAttend" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const [verifying, setVerifying] = useState(false);
  const [marked, setMarked] = useState(true);

  function markNow() {
    setMarked(false);
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setMarked(true);
      toast.success("Attendance marked", { description: "Verified on CampusNet_Secure · iPhone 15 Pro" });
    }, 1800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        description="Attendance is auto-verified through Wi-Fi network and your registered device."
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
                <h2 className="text-2xl font-semibold">{marked ? "Present" : "Not marked yet"}</h2>
                <p className="text-sm text-muted-foreground">
                  {marked ? `Recorded at ${todayStatus.time} via ${todayStatus.method}` : "Connect to authorized Wi-Fi to mark."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Check label="Wi-Fi network" value={wifiNetwork.ssid} ok />
              <Check label="Device" value="iPhone 15 Pro" ok />
              <Check label="Time window" value="09:00–10:00 AM" ok />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={markNow}
                disabled={verifying}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {verifying ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying device & network…</>
                ) : (
                  <>{marked ? "Re-verify" : "Mark attendance now"}</>
                )}
              </Button>
              <Button variant="outline">Request manual review</Button>
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
          <h3 className="font-semibold">Registered Devices used today</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {registeredDevices.filter(d => d.active).map((d) => (
            <div key={d.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{d.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-success">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d.type} · MAC {d.mac}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">Last seen: {d.lastSeen}</p>
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
        <p className="text-sm font-medium">{value}</p>
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
