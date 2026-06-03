import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Copy, Download, Shield } from "lucide-react";
import { wifiNetwork } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/wifi-qr")({
  head: () => ({ meta: [{ title: "Wi-Fi QR · SmartAttend" }] }),
  component: WifiQrPage,
});

function WifiQrPage() {
  // WIFI: QR encoding
  const qrData = encodeURIComponent(`WIFI:T:WPA;S:${wifiNetwork.ssid};P:${wifiNetwork.password};H:false;;`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrData}&color=ffffff&bgcolor=18-22-37&margin=10&qzone=2`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wi-Fi QR Code"
        description="Scan to connect any new device to the authorized campus network."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-surface border-border/60 p-8 flex flex-col items-center text-center shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="relative">
            <div className="rounded-2xl bg-background/80 p-4 border border-border/60 shadow-glow">
              <img
                src={qrUrl}
                alt="Wi-Fi QR code"
                className="h-64 w-64 rounded-lg"
                onError={(e) => {
                  // graceful fallback if API blocked
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p className="mt-6 text-lg font-semibold">{wifiNetwork.ssid}</p>
            <p className="text-xs text-muted-foreground">{wifiNetwork.band} · WPA2 · {wifiNetwork.building}</p>
            <div className="mt-5 flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => copy(wifiNetwork.password, "Password")}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy password
              </Button>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Download className="mr-1.5 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-surface border-border/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Network details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <Detail k="SSID" v={wifiNetwork.ssid} onCopy={() => copy(wifiNetwork.ssid, "SSID")} />
              <Detail k="Password" v="••••••••••" onCopy={() => copy(wifiNetwork.password, "Password")} />
              <Detail k="Security" v="WPA2-PSK" />
              <Detail k="Frequency" v={wifiNetwork.band} />
              <Detail k="Location" v={wifiNetwork.building} />
            </div>
          </Card>

          <Card className="bg-gradient-surface border-border/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">How it works</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Scan the QR with your phone's camera to auto-connect.</li>
              <li>Your device's MAC is captured and matched to your registered devices.</li>
              <li>If you're in an attendance window, your presence is marked automatically.</li>
              <li>Attendance shows up in your dashboard within seconds.</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v, onCopy }: { k: string; v: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium font-mono text-xs">{v}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-muted-foreground hover:text-foreground">
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
