import { Outlet, useNavigate, createFileRoute } from "@tanstack/react-router";
import { Bell, Wifi, CheckCircle2, LogOut } from "lucide-react";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { wifiNetwork } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isReady, signOut } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/login" });
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading session…
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-background/70 backdrop-blur-xl px-4">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {user.role}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
                  <Wifi className="h-3.5 w-3.5 text-primary" />
                  {wifiNetwork.ssid} · {wifiNetwork.signal}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1 pr-3 text-xs">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  signOut();
                  navigate({ to: "/login" });
                }}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
