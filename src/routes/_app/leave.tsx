import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, CalendarOff } from "lucide-react";
import { leaveRequests } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/leave")({
  head: () => ({ meta: [{ title: "Leave Requests · SmartAttend" }] }),
  component: LeavePage,
});

function LeavePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        description="Apply for and track your leave applications."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-1.5 h-4 w-4" /> New request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>New leave request</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast.success("Leave request submitted", { description: "Pending approval from your supervisor." });
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>From</Label>
                    <Input type="date" defaultValue="2026-06-15" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>To</Label>
                    <Input type="date" defaultValue="2026-06-16" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Textarea placeholder="Brief description of the reason" rows={4} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Submit request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Pending" value={leaveRequests.filter(r => r.status === "Pending").length} tone="warning" />
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Approved" value={leaveRequests.filter(r => r.status === "Approved").length} tone="success" />
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Rejected" value={leaveRequests.filter(r => r.status === "Rejected").length} tone="destructive" />
      </div>

      <Card className="bg-gradient-surface border-border/60 p-5">
        <div className="space-y-3">
          {leaveRequests.map((r) => (
            <div key={r.id} className="rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{r.id}</span>
                  <StatusPill status={r.status} />
                </div>
                <p className="mt-1 font-medium">{r.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {r.from} → {r.to} · Applied {r.appliedOn}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                {r.status === "Pending" && <Button variant="ghost" size="sm">Cancel</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  const toneClass = {
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
  }[tone] ?? "bg-primary/15 text-primary";
  return (
    <Card className="bg-gradient-surface border-border/60 p-5 flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </Card>
  );
}
