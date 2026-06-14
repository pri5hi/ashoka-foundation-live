import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";
import { downloadCSV } from "@/lib/admin-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/newsletter")({ component: NewsletterAdmin });

function NewsletterAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: rows } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: async () => (await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function remove(id: string) {
    if (!confirm("Remove subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["admin-newsletter"] });
  }

  const visible = (rows || []).filter((r: any) => !search || `${r.email} ${r.name || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">{visible.length} subscribers</p>
        </div>
        <Button variant="outline" onClick={() => downloadCSV(visible, "subscribers.csv")}><Download className="mr-1 h-4 w-4" /> Export CSV</Button>
      </div>

      <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Active</th><th className="p-3">Date</th><th className="p-3 text-right"></th></tr></thead>
            <tbody>
              {visible.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-medium">{r.email}</td>
                  <td className="p-3">{r.name || "—"}</td>
                  <td className="p-3"><Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge></td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right"><Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
