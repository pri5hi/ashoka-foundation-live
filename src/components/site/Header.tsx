import { Link } from "@tanstack/react-router";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Our Work" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="Creative Ashoka Foundation logo" className="h-10 w-10" width={40} height={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">Creative Ashoka</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Foundation</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-primary bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/volunteer"
            className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Volunteer
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 rounded-md gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95"
          >
            <Heart className="h-4 w-4" /> Donate
          </Link>
        </div>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/85 hover:bg-secondary"
                activeProps={{ className: "rounded-md px-3 py-3 text-sm font-semibold text-primary bg-secondary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/volunteer" onClick={() => setOpen(false)} className="rounded-md border border-primary px-3 py-2.5 text-center text-sm font-medium text-primary">Volunteer</Link>
              <Link to="/donate" onClick={() => setOpen(false)} className="rounded-md gradient-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground">Donate</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
