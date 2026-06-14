import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { initiatives } from "@/data/initiatives";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Creative Ashoka Foundation" },
      { name: "description", content: "Our five flagship initiatives — UDAAN, ANN SE ASHIRWAD, HAR JEEVAN ANMOL, VASUNDHARA and SWABHIMAAN." },
      { property: "og:title", content: "Our Projects" },
      { property: "og:description", content: "Explore our flagship initiatives across education, food, animal welfare, environment and women empowerment." },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Our flagship initiatives."
        subtitle="Five focused programs creating measurable, on-ground impact across India."
      />
      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((p) => (
              <article
                key={p.slug}
                className="hover-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                    {p.name}
                  </h3>
                  <div className="mt-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Objective
                    </dt>
                    <dd className="mt-1 text-sm text-foreground/80">{p.impactGoal}</dd>
                  </div>
                  <div className="mt-auto pt-6">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/gallery">
                        Explore More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
