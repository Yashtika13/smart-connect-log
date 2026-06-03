import { createFileRoute, Link } from "@tanstack/react-router";
import { Wifi, ShieldCheck, BarChart3, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartAttend — Wi-Fi Attendance & Analytics" },
      { name: "description", content: "Automated, real-time attendance via Wi-Fi authentication and device verification." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-glow" />
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

      <header className="flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Wifi className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold tracking-tight">SmartAttend</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Open dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <section className="px-6 lg:px-12 pt-12 pb-24 max-w-6xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Real-time · Wi-Fi authenticated · Device verified
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.95]">
          Attendance that<br />
          <span className="text-gradient">marks itself.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          SmartAttend pairs Wi-Fi network authentication with registered-device verification to
          eliminate proxies and manual roll calls — turning every campus connection into a
          verified, timestamped attendance event.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Launch dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/wifi-qr">
            <Button size="lg" variant="outline">View Wi-Fi QR</Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wifi, title: "Wi-Fi verification", desc: "Mark only on authorized SSID." },
            { icon: Smartphone, title: "Device binding", desc: "One person, one registered device." },
            { icon: ShieldCheck, title: "Anti-proxy", desc: "MAC + credential + window check." },
            { icon: BarChart3, title: "Live analytics", desc: "Daily, weekly, monthly trends." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-gradient-surface border border-border/60 p-5 shadow-elevated">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
