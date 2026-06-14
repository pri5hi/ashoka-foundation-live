import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Layout";
import { toast } from "sonner";
import { Building2, QrCode, Copy } from "lucide-react";
import qrAsset from "@/assets/caf-upi-qr.jpeg.asset.json";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Creative Ashoka Foundation" },
      { name: "description", content: "Donate via bank transfer or QR code. 80G tax-exempt. 100% of your contribution funds on-ground programs." },
      { property: "og:title", content: "Donate to Creative Ashoka Foundation" },
      { property: "og:description", content: "Your contribution funds meals, scholarships and lifesaving care. 80G certified." },
    ],
  }),
  component: Donate,
});

function Donate() {
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };

  return (
    <>
      <PageHero eyebrow="Donate" title="Fund real change — transparently." subtitle="Every contribution is acknowledged with an 80G tax-exemption receipt. Funds are deployed within 30 days and reported publicly." />

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="flex items-center gap-2 text-accent">
              <Building2 className="h-5 w-5" />
              <h3 className="font-display font-semibold text-primary">Bank Transfer</h3>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Account Name", "Creative Ashoka Foundation"],
                ["Bank Name", "Axis Bank"],
                ["Account Number", "925020022668565"],
                ["IFSC Code", "UTIB0005205"],
                ["Branch", "Purani Basti"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 rounded-md bg-secondary/60 px-3 py-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-foreground">{v}</dd>
                  </div>
                  <button onClick={() => copy(v)} className="rounded-md p-2 text-muted-foreground hover:text-accent" aria-label={`Copy ${k}`}>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft md:p-8">
            <div className="flex items-center justify-center gap-2 text-accent">
              <QrCode className="h-5 w-5" />
              <h3 className="font-display font-semibold text-primary">Scan QR</h3>
            </div>
            <div className="mx-auto mt-4 h-48 w-48 overflow-hidden rounded-md border border-border bg-white p-2">
              <img src={qrAsset.url} alt="Creative Ashoka Foundation UPI QR code" className="h-full w-full object-contain" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Scan this code with any UPI app to donate instantly.</p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--cream)] section-y">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Donation Transparency</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">Where your rupee goes</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { p: "72%", t: "Direct Programs", d: "Meals, scholarships, medical aid and relief delivered to beneficiaries." },
              { p: "18%", t: "On-ground Operations", d: "Field staff, logistics and partner coordination across cities." },
              { p: "10%", t: "Admin & Compliance", d: "Audits, statutory filings and donor reporting." },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="font-display text-3xl font-bold text-accent">{s.p}</div>
                <h3 className="mt-1 font-display font-semibold text-primary">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
