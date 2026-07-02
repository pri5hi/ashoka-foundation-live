import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/Layout";
import { X, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Creative Ashoka Foundation" },
      { name: "description", content: "Photo and video gallery from our flagship initiatives across India." },
      { property: "og:title", content: "Gallery — Moments of Impact" },
      { property: "og:description", content: "Photographs and videos from our on-ground work across India." },
    ],
  }),
  component: Gallery,
});

type Cat = "All" | "UDAAN" | "SWABHIMAAN" | "ANN SE ASHIRWAD" | "HAR JEEVAN ANMOL" | "VASUNDHARA";

type MediaItem = {
  src: string;
  cat: Exclude<Cat, "All">;
  alt: string;
  type: "image" | "video";
};

const cats: Cat[] = ["All", "UDAAN", "SWABHIMAAN", "ANN SE ASHIRWAD", "HAR JEEVAN ANMOL", "VASUNDHARA"];

function Gallery() {
  const [f, setF] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async (): Promise<MediaItem[]> => {
      const { data, error } = await supabase
        .from("gallery")
        .select("image_url, category, title, media_type, display_order, created_at")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r) => ({
        src: r.image_url,
        cat: (r.category || "UDAAN") as Exclude<Cat, "All">,
        alt: r.title || r.category || "Gallery media",
        type: r.media_type === "video" ? "video" : "image",
      }));
    },
  });

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

          {isLoading ? (
            <div className="mt-12 text-center text-muted-foreground">Loading gallery…</div>
          ) : (
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
              {list.map((p, i) => (
                <button key={i} onClick={() => setLightbox(p)} className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  {p.type === "video" ? (
                    <>
                      <video src={p.src} preload="metadata" muted playsInline className="w-full" />
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
              {!list.length && (
                <div className="col-span-full text-center text-muted-foreground">No media in this category yet.</div>
              )}
            </div>
          )}
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
