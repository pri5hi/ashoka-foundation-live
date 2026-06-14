import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHero } from "@/components/site/Layout";
import { ArrowRight, Target, BarChart3, Images, Newspaper, Heart } from "lucide-react";
import { initiatives } from "@/data/initiatives";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work — Creative Ashoka Foundation" },
      { name: "description", content: "Our five flagship programs: UDAAN, ANN SE ASHIRWAD, HAR JEEVAN ANMOL, VASUNDHARA and SWABHIMAAN." },
      { property: "og:title", content: "Our Work — Creative Ashoka Foundation" },
      { property: "og:description", content: "Five impact-driven projects transforming lives across India — education, food, animal welfare, environment and women empowerment." },
    ],
  }),
  component: Work,
});

function Work() {
  // Smooth scroll to hash on mount / hash change
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        // small delay to allow layout
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Five flagship projects. One mission — creating hope and transforming lives."
        subtitle="From classrooms to kitchens, from animal shelters to green fields and women's livelihoods — every initiative is designed with the community, measured rigorously, and driven by compassion."
      />

      {/* Quick nav */}
      <section className="border-b border-border bg-[color:var(--cream)]">
        <div className="container-page py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {initiatives.map((p) => (
              <a
                key={p.slug}
                href={`#${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary shadow-soft transition hover:bg-primary hover:text-primary-foreground"
              >
                <p.icon className="h-3.5 w-3.5" /> {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="divide-y divide-border">
        {initiatives.map((p, i) => (
          <section
            key={p.slug}
            id={p.slug}
            className={`scroll-mt-24 section-y ${i % 2 === 1 ? "bg-secondary/40" : ""}`}
          >
            <div className="container-page">
              <div className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-accent-foreground shadow-elevated">
                    <p.icon className="h-6 w-6" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{p.category}</p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{p.name}</h2>
                  <p className="mt-4 text-base text-muted-foreground md:text-lg">{p.description}</p>

                  <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                      <Target className="h-4 w-4" /> Impact Goal
                    </div>
                    <p className="mt-2 text-sm text-foreground/85">{p.impactGoal}</p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: BarChart3, label: "Impact Statistics", note: "Coming Soon" },
                      { icon: Images, label: "Project Gallery", note: "Coming Soon" },
                      { icon: Newspaper, label: "Project Updates", note: "Coming Soon" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
                        <f.icon className="mx-auto h-5 w-5 text-primary" />
                        <div className="mt-2 text-xs font-semibold text-primary">{f.label}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.note}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to="/donate"
                      className="inline-flex items-center gap-2 rounded-md gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95"
                    >
                      <Heart className="h-4 w-4" /> Support {p.name}
                    </Link>
                    <Link
                      to="/volunteer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Volunteer With Us <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
