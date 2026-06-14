import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/Layout";
import { MapPin, Calendar } from "lucide-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import causeFood from "@/assets/cause-food.jpg";
import causeEdu from "@/assets/cause-education.jpg";
import causeHealth from "@/assets/cause-health.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Creative Ashoka Foundation" },
      { name: "description", content: "Completed, ongoing and upcoming projects across India in education, healthcare, food relief and community development." },
      { property: "og:title", content: "Our Projects" },
      { property: "og:description", content: "Browse our verified, on-ground projects with full transparency on objectives, beneficiaries and results." },
    ],
  }),
  component: Projects,
});

type Status = "Completed" | "Ongoing" | "Upcoming";
const projects: { img: string; title: string; loc: string; date: string; status: Status; objective: string; beneficiaries: string; results: string }[] = [
  { img: p1, title: "Green Villages Initiative", loc: "Rajasthan", date: "Started Jun 2024", status: "Ongoing", objective: "Plant 10,000 native trees with school children.", beneficiaries: "20 villages, 4,000 students", results: "6,200 saplings planted, 78% survival rate." },
  { img: p2, title: "Monsoon Flood Relief", loc: "Assam", date: "Aug 2024", status: "Completed", objective: "Emergency food, water and medical aid for displaced families.", beneficiaries: "1,800 families", results: "₹42L disbursed, 14 medical camps held." },
  { img: p3, title: "Padho Beti Padho Scholarship", loc: "Uttar Pradesh", date: "Annual", status: "Ongoing", objective: "Full-year scholarships for first-generation girl students.", beneficiaries: "500 girls", results: "92% retention vs 61% district average." },
  { img: causeEdu, title: "Digital Learning Labs", loc: "Bihar", date: "2025", status: "Upcoming", objective: "Equip 25 government schools with computer labs.", beneficiaries: "8,500 students", results: "Launching Q2 2025." },
  { img: causeFood, title: "Annapurna Community Kitchens", loc: "Delhi NCR", date: "Daily", status: "Ongoing", objective: "Hot meals for daily-wage workers and the elderly.", beneficiaries: "600 people / day", results: "1.2L+ meals served this year." },
  { img: causeHealth, title: "Sehat Mobile Clinic", loc: "Maharashtra", date: "2023", status: "Completed", objective: "Bring primary healthcare to 30 remote villages.", beneficiaries: "18,000 patients", results: "12,400 treated, 920 referred to hospitals." },
];

const filters: (Status | "All")[] = ["All", "Ongoing", "Completed", "Upcoming"];

function Projects() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = f === "All" ? projects : projects.filter((p) => p.status === f);

  const statusStyles: Record<Status, string> = {
    Ongoing: "bg-accent text-accent-foreground",
    Completed: "bg-primary text-primary-foreground",
    Upcoming: "bg-secondary text-primary",
  };

  return (
    <>
      <PageHero eyebrow="Projects" title="Every project, fully documented." subtitle="Filter by status to see what's running today, what's complete, and what's launching next." />
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            {filters.map((x) => (
              <button
                key={x}
                onClick={() => setF(x)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${f === x ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-foreground/75 hover:border-accent"}`}
              >
                {x}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <article key={p.title} className="hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="relative">
                  <img src={p.img} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[p.status]}`}>{p.status}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-primary">{p.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.loc}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div><dt className="text-xs font-semibold uppercase tracking-wider text-accent">Objective</dt><dd className="text-foreground/80">{p.objective}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wider text-accent">Beneficiaries</dt><dd className="text-foreground/80">{p.beneficiaries}</dd></div>
                    <div><dt className="text-xs font-semibold uppercase tracking-wider text-accent">Results</dt><dd className="text-foreground/80">{p.results}</dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
