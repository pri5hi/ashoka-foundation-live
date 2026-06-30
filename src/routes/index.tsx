import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Sparkles, Users, Quote, ShieldCheck, HandHeart, CheckCircle2 } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { initiatives } from "@/data/initiatives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creative Ashoka Foundation — Serving Humanity, Creating Hope" },
      { name: "description", content: "Indian non-profit empowering underprivileged communities through education, healthcare, food relief and sustainable development. Donate, volunteer, or request help today." },
      { property: "og:title", content: "Creative Ashoka Foundation — Serving Humanity, Creating Hope" },
      { property: "og:description", content: "Together we can change lives. Support our work in education, health, food relief and women empowerment across India." },
    ],
  }),
  component: Home,
});

function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setVal(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, val };
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold text-primary md:text-5xl">
        <span ref={ref}>{val.toLocaleString()}</span><span className="text-accent">{suffix ?? "+"}</span>
      </div>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}


const testimonials = [
  { quote: "Being a part of Udaan initiative was truly inspiring. This is not just about education; it is about giving children hope, confidence, and the courage to dream bigger.", name: "Anshika Tiwari", role: "Volunteer, UP" },
  { quote: "I've seen Creative Ashoka Foundation work quietly but tirelessly for both people and animals. Their efforts through Udaan and other initiatives prove that real change begins with compassion and action. Truly a foundation that inspires hope.", name: "Manish Shah", role: "Advocate High Court, Lucknow" },
  { quote: "Creative Ashoka Foundation is one of those rare organizations that genuinely cares. From educating children to helping animals, their work reflects true compassion and creates a real impact in the community.", name: "Anjali S.", role: "Alumna, UP" },
];

function Home() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Children studying in an Indian classroom" className="absolute inset-0 -z-10 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="container-page py-24 text-primary-foreground md:py-36">
          <p className="fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <Heart className="h-3.5 w-3.5 text-[color:var(--ashoka)]" /> Serving Humanity, Creating Hope
          </p>
          <h1 className="fade-up max-w-3xl text-balance font-display text-4xl font-bold leading-tight md:text-6xl">
            Together We Can <span className="text-[color:var(--ashoka)]">Change Lives</span>
          </h1>
          <p className="fade-up mt-5 max-w-2xl text-balance text-base text-white/85 md:text-lg">
            Supporting communities, empowering individuals, and creating opportunities for a better tomorrow — across schools, villages and cities of India.
          </p>
          <div className="fade-up mt-8 flex flex-wrap gap-3">
            <Link to="/donate" className="inline-flex items-center gap-2 rounded-md gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-elevated transition hover:opacity-95">
              <Heart className="h-4 w-4" /> Donate Now
            </Link>
            <Link to="/volunteer" className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-primary">
              Become a Volunteer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-y border-border bg-[color:var(--cream)]">
        <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <Stat value={1200} label="Lives Impacted" />
          <Stat value={50} label="Community Projects" />
          <Stat value={100} label="Active Volunteers" />
          <Stat value={3} label="Cities Reached" />
        </div>
      </section>

      {/* CAUSES */}
      <section className="section-y">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Flagship Initiatives</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">Where your support goes</h2>
            <p className="mt-3 text-muted-foreground">Five flagship projects, one mission — creating hope and transforming lives across India.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {initiatives.map(({ slug, name, category, shortDesc, image, icon: Icon }) => (
              <Link
                key={slug}
                to="/work"
                hash={slug}
                className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-elevated"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full gradient-accent text-accent-foreground shadow-elevated">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-primary">{name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">{category}</p>
                  <p className="mt-3 text-sm text-muted-foreground flex-1">{shortDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all group-hover:gap-2">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>




      {/* WHY TRUST */}
      <section className="section-y">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why Trust Us</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">Transparency you can verify, impact you can see.</h2>
            <p className="mt-4 text-muted-foreground">Every rupee is tracked. Every project is documented. Every beneficiary is real — because trust is the only currency a non-profit truly owns.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Audited financials published every quarter",
                "80G & 12A certified for tax-exempt donations",
                "On-ground verification of every project",
                "Community-led decision making",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" /> <span className="text-foreground/85">{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: "Verified Non-Profit", sub: "Registered under Indian Trust Act" },
              { icon: HandHeart, label: "100% Direct Aid", sub: "Funds reach beneficiaries, not overheads" },
              { icon: Users, label: "Community Led", sub: "Designed with the people we serve" },
              { icon: Sparkles, label: "Measurable Impact", sub: "Outcomes reported publicly" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-display font-semibold text-primary">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[color:var(--cream)] section-y">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <Quote className="mx-auto h-8 w-8 text-accent" />
            <blockquote className="mt-5 min-h-[140px] font-display text-xl text-foreground md:text-2xl">
              "{testimonials[active].quote}"
            </blockquote>
            <div className="mt-5 text-sm font-semibold text-primary">{testimonials[active].name}</div>
            <div className="text-xs text-muted-foreground">{testimonials[active].role}</div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} aria-label={`Testimonial ${i+1}`} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-accent" : "w-2 bg-border"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-elevated md:p-16">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">Your small contribution can make a big difference.</h2>
                <p className="mt-3 max-w-xl text-primary-foreground/85">Join thousands of compassionate Indians funding meals, schools and lifesaving care every month.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/donate" className="inline-flex items-center gap-2 rounded-md gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft"><Heart className="h-4 w-4" /> Donate Today</Link>
                <Link to="/volunteer" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-primary transition">Volunteer With Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
