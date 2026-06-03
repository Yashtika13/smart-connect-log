import { Outlet, Link, createFileRoute } from "@tanstack/react-router";
import { Bell, Wifi, CheckCircle2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { wifiNetwork, currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
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
                  <CheckCircle2 className="h-3.5 w-3.5" /> Authorized
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
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1 pr-3 text-xs hover:bg-secondary/80"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
                  {currentUser.avatar}
                </span>
                <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
              </Link>
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
