import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Layout";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Compass, Sparkles } from "lucide-react";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Creative Ashoka Foundation" },
      { name: "description", content: "Join 100+ volunteers serving communities across India. Sign up to teach, lead drives, run health camps and more." },
      { property: "og:title", content: "Volunteer With Creative Ashoka" },
      { property: "og:description", content: "Lend your skills, time and heart to causes that change lives." },
    ],
  }),
  component: Volunteer,
});

const why = [
  { icon: Users, t: "Community Impact", d: "See your hours turn into meals served, lessons taught and lives changed." },
  { icon: Compass, t: "Leadership Opportunities", d: "Lead a drive, mentor a child, manage a camp — grow as you serve." },
  { icon: Sparkles, t: "Social Responsibility", d: "Belong to something bigger than yourself, with people who care like you do." },
];

const cls = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

function Volunteer() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    const { error } = await supabase.from("volunteers").insert({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      city: String(fd.get("city") ?? ""),
      skills: String(fd.get("skills") ?? "") || null,
      availability: String(fd.get("avail") ?? ""),
      message: String(fd.get("msg") ?? "") || null,
    });
    setLoading(false);
    if (error) { toast.error("Could not submit. Please try again."); return; }
    toast.success("Thank you! Our volunteer team will be in touch within 3 working days.");
    form.reset();
  };

  return (
    <>
      <PageHero eyebrow="Volunteer" title="Lend your time. Lift a life." subtitle="Whether you have an hour a week or a weekend a month, there's a place for you in our work." />

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why Volunteer With Us</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">Service that fits your life.</h2>
            <p className="mt-4 text-foreground/80">We match every volunteer to projects that align with their skills, schedule and city. No prior experience required — only intent.</p>
            <ul className="mt-6 space-y-5">
              {why.map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="font-display font-semibold text-primary">{t}</div>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-elevated md:p-8">
            <h3 className="font-display text-xl font-bold text-primary">Join our volunteer network</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name *"><input required name="name" className={cls} /></Field>
              <Field label="Phone *"><input required name="phone" type="tel" className={cls} /></Field>
              <Field label="Email *"><input required name="email" type="email" className={cls} /></Field>
              <Field label="City *"><input required name="city" className={cls} /></Field>
              <Field label="Skills"><input name="skills" placeholder="e.g. teaching, medicine, design" className={cls} /></Field>
              <Field label="Availability">
                <select name="avail" className={cls} defaultValue="weekends">
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </Field>
            </div>
            <Field label="Why do you want to volunteer?">
              <textarea name="msg" rows={4} maxLength={800} className={`${cls} min-h-[110px]`} />
            </Field>
            <button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft hover:opacity-95 disabled:opacity-60">
              {loading ? "Submitting…" : "Sign Up to Volunteer"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">{label}</span>
      {children}
    </label>
  );
}
