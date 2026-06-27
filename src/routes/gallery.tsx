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

type Cat = "All" | "UDAAN" | "HAR JEEVAN ANMOL" | "VASUNDHARA" | "Food Drives" | "Education" | "Medical Camps" | "Community" | "Volunteers";

type MediaItem = { src: string; cat: Exclude<Cat, "All">; alt: string; type?: "image" | "video"; poster?: string };

const udaanModules = import.meta.glob("@/assets/udaan/Udaan*.jpg.asset.json", {
  eager: true,
}) as Record<string, { default: { url: string; original_filename: string } }>;

const udaanPhotos: MediaItem[] = Object.values(udaanModules)
  .map((m) => m.default)
  .filter((a) => !/Udaan_Header/i.test(a.original_filename))
  .sort((a, b) => {
    const na = parseInt(a.original_filename.replace(/\D/g, ""), 10) || 0;
    const nb = parseInt(b.original_filename.replace(/\D/g, ""), 10) || 0;
    return na - nb;
  })
  .map((a) => ({ src: a.url, cat: "UDAAN" as const, alt: `UDAAN — ${a.original_filename.replace(/\.[^.]+$/, "")}`, type: "image" }));

const hjaModules = import.meta.glob("@/assets/har-jeevan-anmol/*.asset.json", {
  eager: true,
}) as Record<string, { default: { url: string; original_filename: string } }>;

const hjaHeaderUrl = Object.values(hjaModules).find((m) => /Header/i.test(m.default.original_filename))?.default.url;

const hjaMedia: MediaItem[] = Object.values(hjaModules)
  .map((m) => m.default)
  .sort((a, b) => {
    const na = parseInt(a.original_filename.replace(/\D/g, ""), 10) || 0;
    const nb = parseInt(b.original_filename.replace(/\D/g, ""), 10) || 0;
    return na - nb;
  })
  .map((a) => {
    const isVideo = /\.(mp4|webm|mov)$/i.test(a.original_filename);
    return {
      src: a.url,
      cat: "HAR JEEVAN ANMOL" as const,
      alt: `HAR JEEVAN ANMOL — ${a.original_filename.replace(/\.[^.]+$/, "")}`,
      type: isVideo ? ("video" as const) : ("image" as const),
      poster: isVideo ? hjaHeaderUrl : undefined,
    };
  });

const photos: MediaItem[] = [
  ...udaanPhotos,
  ...hjaMedia,
  { src: causeFood, cat: "Food Drives", alt: "Food distribution", type: "image" },
  { src: causeEdu, cat: "Education", alt: "Classroom", type: "image" },
  { src: causeHealth, cat: "Medical Camps", alt: "Free health camp", type: "image" },
  { src: causeWomen, cat: "Volunteers", alt: "Skill training", type: "image" },
  { src: causeCommunity, cat: "Community", alt: "Cleanliness drive", type: "image" },
  { src: p1, cat: "Community", alt: "Tree plantation", type: "image" },
  { src: p2, cat: "Food Drives", alt: "Flood relief", type: "image" },
  { src: p3, cat: "Education", alt: "Scholarship recipient", type: "image" },
];

const cats: Cat[] = ["All", "UDAAN", "HAR JEEVAN ANMOL", "Food Drives", "Education", "Medical Camps", "Community", "Volunteers"];

function Gallery() {
  const [f, setF] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
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
              <button key={i} onClick={() => setLightbox(p)} className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                {p.type === "video" ? (
                  <>
                    {p.poster ? (
                      <img src={p.poster} alt={p.alt} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <video src={p.src} preload="metadata" muted playsInline className="w-full" />
                    )}
                    <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/20">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-elevated transition group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={p.src} alt={p.alt} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} role="dialog" aria-modal className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4">
          <button aria-label="Close" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-foreground"><X className="h-5 w-5" /></button>
          {lightbox.type === "video" ? (
            <video src={lightbox.src} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-full rounded-lg shadow-elevated bg-black" />
          ) : (
            <img src={lightbox.src} alt={lightbox.alt} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-full rounded-lg shadow-elevated" />
          )}
        </div>
      )}
    </>
  );
}
