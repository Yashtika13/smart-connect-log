import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, CalendarOff, Loader2, AlertCircle, Check, X } from "lucide-react";
import { leaveApi, type LeaveRecord } from "@/lib/api/leave";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/leave")({
  head: () => ({ meta: [{ title: "Leave Requests · SmartAttend" }] }),
  component: LeavePage,
});

function LeavePage() {
  const qc = useQueryClient();
  const { hasRole } = useAuth();
  const isManager = hasRole("ADMIN") || hasRole("STAFF");

  const minQuery = useQuery({ queryKey: ["leaves", "me"], queryFn: () => leaveApi.mine() });
  const pendingQuery = useQuery({
    queryKey: ["leaves", "pending"],
    queryFn: () => leaveApi.pending(),
    enabled: isManager,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

  const createMut = useMutation({
    mutationFn: () => leaveApi.create(form),
    onSuccess: () => {
      toast.success("Leave request submitted");
      setOpen(false);
      setForm({ startDate: "", endDate: "", reason: "" });
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (e) => toast.error("Failed", { description: e instanceof ApiError ? e.message : (e as Error).message }),
  });

  const decideMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "APPROVED" | "REJECTED" }) => leaveApi.decide(id, status),
    onSuccess: (_d, vars) => {
      toast.success(`Leave ${vars.status.toLowerCase()}`);
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (e) => toast.error("Failed", { description: (e as Error).message }),
  });

  const records = minQuery.data ?? [];
  const counts = {
    pending: records.filter((r) => r.status === "PENDING").length,
    approved: records.filter((r) => r.status === "APPROVED").length,
    rejected: records.filter((r) => r.status === "REJECTED").length,
  };

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
              <DialogHeader><DialogTitle>New leave request</DialogTitle></DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); createMut.mutate(); }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>From</Label>
                    <Input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>To</Label>
                    <Input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Textarea rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Brief description of the reason" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMut.isPending} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    {createMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Pending" value={counts.pending} tone="warning" />
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Approved" value={counts.approved} tone="success" />
        <Stat icon={<CalendarOff className="h-5 w-5" />} label="Rejected" value={counts.rejected} tone="destructive" />
      </div>

      {minQuery.isLoading && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
      {minQuery.error && (
        <div className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 mt-0.5" />{(minQuery.error as Error).message}</div>
      )}

      <Card className="bg-gradient-surface border-border/60 p-5">
        <h3 className="font-semibold mb-3">My Requests</h3>
        <div className="space-y-3">
          {records.map((r) => <LeaveRow key={r.id} r={r} />)}
          {records.length === 0 && <p className="text-sm text-muted-foreground">No requests yet.</p>}
        </div>
      </Card>

      {isManager && (
        <Card className="bg-gradient-surface border-border/60 p-5">
          <h3 className="font-semibold mb-3">Pending Approvals</h3>
          {pendingQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          <div className="space-y-3">
            {pendingQuery.data?.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{r.fullName} <span className="text-xs text-muted-foreground">#{r.id}</span></p>
                  <p className="text-sm">{r.reason ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{r.startDate} → {r.endDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => decideMut.mutate({ id: r.id, status: "APPROVED" })} disabled={decideMut.isPending}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => decideMut.mutate({ id: r.id, status: "REJECTED" })} disabled={decideMut.isPending}>
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
            {pendingQuery.data?.length === 0 && <p className="text-sm text-muted-foreground">Nothing pending.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}

function LeaveRow({ r }: { r: LeaveRecord }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">#{r.id}</span>
          <StatusPill status={r.status.charAt(0) + r.status.slice(1).toLowerCase()} />
        </div>
        <p className="mt-1 font-medium">{r.reason ?? "—"}</p>
        <p className="text-xs text-muted-foreground">
          {r.startDate} → {r.endDate} · Applied {new Date(r.createdAt).toLocaleDateString()}
        </p>
      </div>
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
