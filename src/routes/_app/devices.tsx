import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Smartphone, Laptop, Tablet, Plus, Trash2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { deviceApi, type DeviceRecord } from "@/lib/api/device";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/devices")({
  head: () => ({ meta: [{ title: "My Devices · SmartAttend" }] }),
  component: DevicesPage,
});

const iconFor = (t: string | null) =>
  t === "Laptop" ? Laptop : t === "Tablet" ? Tablet : Smartphone;

function DevicesPage() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["devices", "me"],
    queryFn: () => deviceApi.mine(),
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ deviceName: "", macAddress: "", deviceType: "Mobile", primary: false });

  const createMut = useMutation({
    mutationFn: () => deviceApi.register(form),
    onSuccess: () => {
      toast.success("Device registered");
      setOpen(false);
      setForm({ deviceName: "", macAddress: "", deviceType: "Mobile", primary: false });
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (e) => toast.error("Failed", { description: e instanceof ApiError ? e.message : (e as Error).message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deviceApi.remove(id),
    onSuccess: () => {
      toast.success("Device removed");
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (e) => toast.error("Failed", { description: (e as Error).message }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registered Devices"
        description="Only registered devices on the authorized Wi-Fi can mark your attendance."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-1.5 h-4 w-4" /> Register device
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader><DialogTitle>Register a new device</DialogTitle></DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); createMut.mutate(); }}
              >
                <div className="space-y-1.5">
                  <Label>Device name</Label>
                  <Input required value={form.deviceName} onChange={(e) => setForm({ ...form, deviceName: e.target.value })} placeholder="iPhone 15 Pro" />
                </div>
                <div className="space-y-1.5">
                  <Label>MAC address</Label>
                  <Input required value={form.macAddress} onChange={(e) => setForm({ ...form, macAddress: e.target.value })} placeholder="A4:83:E7:91:2C:D5" />
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.deviceType}
                    onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                  >
                    <option>Mobile</option><option>Laptop</option><option>Tablet</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.checked })} />
                  Mark as primary device
                </label>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMut.isPending} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    {createMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Register
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
      {error && (
        <Card className="p-4 border-destructive/40 bg-destructive/5 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
          <div className="text-sm">
            <p>{(error as Error).message}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>Retry</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((d: DeviceRecord) => {
          const Icon = iconFor(d.deviceType);
          return (
            <Card key={d.id} className="bg-gradient-surface border-border/60 p-5 shadow-elevated">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 ${d.verified ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {d.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="mt-4">
                <p className="font-semibold">{d.deviceName}{d.primary && <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">Primary</span>}</p>
                <p className="text-xs text-muted-foreground">{d.deviceType ?? "Device"}</p>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>MAC</span><span className="font-mono text-foreground/80">{d.macAddress}</span></div>
                <div className="flex justify-between"><span>Registered</span><span className="text-foreground/80">{new Date(d.registeredAt).toLocaleDateString()}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" /> ID #{d.id}
                </span>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => deleteMut.mutate(d.id)}
                  disabled={deleteMut.isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
        {data && data.length === 0 && (
          <Card className="p-6 text-sm text-muted-foreground col-span-full text-center">No devices registered yet.</Card>
        )}
      </div>
    </div>
  );
}
