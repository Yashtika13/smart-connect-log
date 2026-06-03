import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Present: "bg-success/15 text-success border-success/30",
  Absent: "bg-destructive/15 text-destructive border-destructive/30",
  Late: "bg-warning/15 text-warning border-warning/30",
  Leave: "bg-accent/15 text-accent border-accent/30",
  "On Leave": "bg-accent/15 text-accent border-accent/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Approved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        map[status] ?? "bg-secondary text-secondary-foreground border-border",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
