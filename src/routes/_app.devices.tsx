import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Laptop, Tablet, Plus, Trash2, ShieldCheck } from "lucide-react";
import { registeredDevices } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/devices")({
  head: () => ({ meta: [{ title: "My Devices · SmartAttend" }] }),
  component: DevicesPage,
});

const iconFor = (t: string) => t === "Laptop" ? Laptop : t === "Tablet" ? Tablet : Smartphone;

function DevicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registered Devices"
        description="Only registered devices on the authorized Wi-Fi can mark your attendance."
        actions={
          <Button
            onClick={() => toast.info("Device registration", { description: "Connect a new device to CampusNet_Secure to register it." })}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Register device
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {registeredDevices.map((d) => {
          const Icon = iconFor(d.type);
          return (
            <Card key={d.id} className="bg-gradient-surface border-border/60 p-5 shadow-elevated">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 ${d.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {d.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-4">
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.type}</p>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>MAC</span><span className="font-mono text-foreground/80">{d.mac}</span></div>
                <div className="flex justify-between"><span>Device ID</span><span className="font-mono text-foreground/80">{d.id}</span></div>
                <div className="flex justify-between"><span>Last seen</span><span className="text-foreground/80">{d.lastSeen}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-success">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                </span>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
