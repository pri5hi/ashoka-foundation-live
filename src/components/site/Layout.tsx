import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChromeless = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  if (isChromeless) {
    return (
      <>
        {children}
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="gradient-hero relative overflow-hidden text-primary-foreground">
      <div className="container-page py-16 md:py-24">
        {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[color:var(--ashoka)]">{eyebrow}</p>}
        <h1 className="text-balance font-display text-3xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-balance text-base text-primary-foreground/85 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
