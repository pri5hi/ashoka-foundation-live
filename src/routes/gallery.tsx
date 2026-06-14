import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/Layout";
import { X, Play } from "lucide-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import causeFood from "@/assets/cause-food.jpg";
import causeEdu from "@/assets/cause-education.jpg";
import causeHealth from "@/assets/cause-health.jpg";
import causeWomen from "@/assets/cause-women.jpg";
import causeCommunity from "@/assets/cause-community.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Creative Ashoka Foundation" },
      { name: "description", content: "Photo and video gallery from our food drives, education programs, medical camps and community events." },
      { property: "og:title", content: "Gallery — Moments of Impact" },
      { property: "og:description", content: "Photographs and videos from our on-ground work across India." },
    ],
  }),
  component: Gallery,
});

type Cat = "All" | "Food Drives" | "Education" | "Medical Camps" | "Community" | "Volunteers";
const photos: { src: string; cat: Exclude<Cat, "All">; alt: string }[] = [
  { src: causeFood, cat: "Food Drives", alt: "Food distribution" },
  { src: causeEdu, cat: "Education", alt: "Classroom" },
  { src: causeHealth, cat: "Medical Camps", alt: "Free health camp" },
  { src: causeWomen, cat: "Volunteers", alt: "Skill training" },
  { src: causeCommunity, cat: "Community", alt: "Cleanliness drive" },
  { src: p1, cat: "Community", alt: "Tree plantation" },
  { src: p2, cat: "Food Drives", alt: "Flood relief" },
  { src: p3, cat: "Education", alt: "Scholarship recipient" },
];

const cats: Cat[] = ["All", "Food Drives", "Education", "Medical Camps", "Community", "Volunteers"];

function Gallery() {
  const [f, setF] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const list = f === "All" ? photos : photos.filter((p) => p.cat === f);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments of impact." subtitle="Every photograph is a story — of someone helped, a community changed, a volunteer who showed up." />
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setF(c)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${f === c ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent"}`}>{c}</button>
            ))}
          </div>

          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
            {list.map((p, i) => (
              <button key={i} onClick={() => setLightbox(p.src)} className="group block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-primary">Video Stories</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map((i) => (
                <div key={i} className="group relative aspect-video overflow-hidden rounded-2xl border border-border shadow-soft gradient-hero">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-elevated transition group-hover:scale-110">
                      <Play className="h-6 w-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">Field Story #{i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} role="dialog" aria-modal className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4">
          <button aria-label="Close" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-foreground"><X className="h-5 w-5" /></button>
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-full rounded-lg shadow-elevated" />
        </div>
      )}
    </>
  );
}
