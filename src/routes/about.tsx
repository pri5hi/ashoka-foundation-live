import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Layout";
import { Heart, Eye, Compass, Users, Shield, HandHeart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Creative Ashoka Foundation" },
      { name: "description", content: "Our story, mission, vision and leadership team driving social change across India." },
      { property: "og:title", content: "About Creative Ashoka Foundation" },
      { property: "og:description", content: "Compassion, transparency and service — the principles behind every initiative we run." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Heart, t: "Compassion", d: "We listen first, judge never, and act with empathy." },
  { icon: Shield, t: "Transparency", d: "Every rupee, every report — fully open to our donors." },
  { icon: Users, t: "Equality", d: "Caste, creed and gender never decide who we serve." },
  { icon: HandHeart, t: "Service", d: "We measure success in lives lifted, not awards won." },
  { icon: Sparkles, t: "Integrity", d: "Doing the right thing — even when no one is watching." },
];

const leaders = [
  { name: "Aarav Sharma", role: "Founder & Chairperson", bio: "20+ years in social development across rural India." },
  { name: "Dr. Neha Verma", role: "Trustee — Healthcare", bio: "Public-health physician leading our medical camps." },
  { name: "Imran Sheikh", role: "Trustee — Operations", bio: "Coordinates field teams across 12 cities." },
  { name: "Priya Iyer", role: "Programs Lead", bio: "Designs our education and women-empowerment work." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A movement of ordinary Indians doing extraordinary things."
        subtitle="Creative Ashoka Foundation began in 2018 with a simple belief — that no child should sleep hungry, no parent should choose between medicine and meals, and no woman should be invisible."
      />

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Story</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">From one community kitchen to a nationwide movement.</h2>
            <p className="mt-4 text-foreground/80">
              What started as a few friends serving warm meals outside a Delhi hospital has grown into a registered foundation working across 12 cities. Today we run scholarships, free clinics, women's skill centres and emergency relief — but our roots remain the same: showing up, listening, and serving.
            </p>
            <p className="mt-3 text-foreground/80">
              We are powered by a network of 100+ volunteers, hundreds of monthly donors and dozens of local partners who believe that real change is built block by block, not headline by headline.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Compass className="h-7 w-7 text-accent" />
              <h3 className="mt-3 font-display text-lg font-semibold text-primary">Mission</h3>
              <p className="mt-2 text-sm text-muted-foreground">To uplift underprivileged individuals and communities through education, healthcare, social welfare and sustainable development initiatives.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Eye className="h-7 w-7 text-accent" />
              <h3 className="mt-3 font-display text-lg font-semibold text-primary">Vision</h3>
              <p className="mt-2 text-sm text-muted-foreground">An India where every person — regardless of birth or background — has the dignity, opportunity and care to live their fullest life.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--cream)] section-y">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Core Values</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">The principles we never bend.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-3 font-display font-semibold text-primary">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Leadership</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">Meet the people behind the work.</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((l) => (
              <div key={l.name} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                <div className="mx-auto h-20 w-20 rounded-full gradient-hero" aria-hidden />
                <h3 className="mt-4 font-display font-semibold text-primary">{l.name}</h3>
                <p className="text-xs uppercase tracking-wider text-accent">{l.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
