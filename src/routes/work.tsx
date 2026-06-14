import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHero } from "@/components/site/Layout";
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
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
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
        {initiatives.map((p, i) => {
          const isLeftImage = i % 2 === 0; // 0, 2, 4 = left image; 1, 3 = right image
          const imageBlock = (
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          );
          const textBlock = (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{p.category}</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{p.name}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{p.description}</p>
            </div>
          );

          return (
            <section
              key={p.slug}
              id={p.slug}
              className={`scroll-mt-24 section-y ${i % 2 === 1 ? "bg-secondary/40" : ""}`}
            >
              <div className="container-page">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  {isLeftImage ? imageBlock : textBlock}
                  {isLeftImage ? textBlock : imageBlock}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
