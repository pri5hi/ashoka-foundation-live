import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  FolderKanban, Image as ImageIcon, Newspaper, Users, IndianRupee, Mail, Send,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

async function fetchCount(table: string) {
  const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold">{value.toLocaleString("en-IN")}</div>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-md ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => ({
      projects: await fetchCount("projects"),
      gallery: await fetchCount("gallery"),
      blogs: await fetchCount("blogs"),
      volunteers: await fetchCount("volunteers"),
      donations: await fetchCount("donations"),
      contacts: await fetchCount("contact_messages"),
      newsletter: await fetchCount("newsletter_subscribers"),
    }),
  });
  const { data: recentVol } = useQuery({
    queryKey: ["recent-vol"],
    queryFn: async () =>
      (await supabase.from("volunteers").select("*").order("created_at", { ascending: false }).limit(5)).data || [],
  });
  const { data: recentDon } = useQuery({
    queryKey: ["recent-don"],
    queryFn: async () =>
      (await supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(5)).data || [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">A snapshot of activity across the foundation.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Projects" value={data?.projects ?? 0} icon={FolderKanban} color="bg-primary/10 text-primary" />
        <StatCard label="Gallery Items" value={data?.gallery ?? 0} icon={ImageIcon} color="bg-accent/10 text-accent" />
        <StatCard label="Blog Posts" value={data?.blogs ?? 0} icon={Newspaper} color="bg-primary/10 text-primary" />
        <StatCard label="Volunteers" value={data?.volunteers ?? 0} icon={Users} color="bg-primary/10 text-primary" />
        <StatCard label="Donations" value={data?.donations ?? 0} icon={IndianRupee} color="bg-accent/10 text-accent" />
        <StatCard label="Contact Messages" value={data?.contacts ?? 0} icon={Mail} color="bg-primary/10 text-primary" />
        <StatCard label="Subscribers" value={data?.newsletter ?? 0} icon={Send} color="bg-accent/10 text-accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-3">Recent Volunteers</h3>
          <ul className="space-y-3">
            {(recentVol || []).map((r: any) => (
              <li key={r.id} className="border-b border-border pb-2 last:border-0">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.city} · {r.email}</div>
              </li>
            ))}
            {!recentVol?.length && <li className="text-sm text-muted-foreground">No volunteers yet.</li>}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-3">Recent Donations</h3>
          <ul className="space-y-3">
            {(recentDon || []).map((r: any) => (
              <li key={r.id} className="border-b border-border pb-2 last:border-0">
                <div className="text-sm font-medium">₹{Number(r.amount).toLocaleString("en-IN")} <span className="text-xs text-muted-foreground">· {r.donor_name}</span></div>
                <div className="text-xs text-muted-foreground">{r.cause || "General"} · {new Date(r.created_at).toLocaleDateString()}</div>
              </li>
            ))}
            {!recentDon?.length && <li className="text-sm text-muted-foreground">No donations yet.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
