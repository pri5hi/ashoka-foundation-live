import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/impact")({ component: ImpactAdmin });

function ImpactAdmin() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-impact"],
    queryFn: async () => (await supabase.from("impact_stats").select("*").order("display_order")).data || [],
  });

  async function update(key: string, patch: any) {
    const { error } = await supabase.from("impact_stats").update(patch).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-impact"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Impact Statistics</h1>
        <p className="text-sm text-muted-foreground">These counters update the homepage instantly.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(rows || []).map((r: any) => (
          <Card key={r.key} className="p-5 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{r.key}</div>
              <Input className="mt-1" value={r.label} onChange={(e) => qc.setQueryData(["admin-impact"], (old: any) => old?.map((x: any) => x.key === r.key ? { ...x, label: e.target.value } : x))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Value</label>
                <Input type="number" value={r.value} onChange={(e) => qc.setQueryData(["admin-impact"], (old: any) => old?.map((x: any) => x.key === r.key ? { ...x, value: Number(e.target.value) } : x))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Suffix</label>
                <Input value={r.suffix || ""} onChange={(e) => qc.setQueryData(["admin-impact"], (old: any) => old?.map((x: any) => x.key === r.key ? { ...x, suffix: e.target.value } : x))} />
              </div>
            </div>
            <Button className="w-full" onClick={() => update(r.key, { label: r.label, value: r.value, suffix: r.suffix })}>Save</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
