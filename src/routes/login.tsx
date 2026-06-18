import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Wifi, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isReady } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && isAuthenticated) navigate({ to: "/dashboard" });
  }, [isReady, isAuthenticated, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = await signIn({ usernameOrEmail, password });
      toast.success(`Welcome, ${u.fullName.split(" ")[0]}`, { description: `Signed in as ${u.role}` });
      navigate({ to: "/dashboard" });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 0
            ? "Cannot reach the API. Is the Spring Boot backend running on :8080?"
            : err.message
          : "Sign in failed";
      setError(msg);
      toast.error("Sign in failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-surface border-r border-border/60 p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Wifi className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">SmartAttend</span>
        </div>
        <div>
          <h2 className="text-4xl font-semibold tracking-tight leading-tight">
            One connection.<br />
            <span className="text-gradient">One verified presence.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Sign in to mark attendance through your registered device on the campus network.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 SmartAttend</div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Use your institutional credentials.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username or Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="pl-9"
                  placeholder="admin or admin@smartattend.local"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
            ) : (
              <>Sign in <ArrowRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>

          <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Default admin:</span> <code>admin</code> / <code>admin123</code> (see backend <code>schema.sql</code>).
          </div>
        </form>
      </div>
    </div>
  );
}
