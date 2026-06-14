import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/donations")({ component: DonationsAdmin });

function DonationsAdmin() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");

  const { data: rows } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => (await supabase.from("donations").select("*").order("created_at", { ascending: false })).data || [],
  });

  const months = useMemo(() => {
    const set = new Set<string>();
    (rows || []).forEach((r: any) => set.add(new Date(r.created_at).toISOString().slice(0, 7)));
    return Array.from(set).sort().reverse();
  }, [rows]);

  const visible = (rows || []).filter((r: any) =>
    (month === "all" || new Date(r.created_at).toISOString().startsWith(month)) &&
    (!search || `${r.donor_name} ${r.email} ${r.cause || ""}`.toLowerCase().includes(search.toLowerCase()))
  );

  const total = visible.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Donations</h1>
          <p className="text-sm text-muted-foreground">{visible.length} records · Total ₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadCSV(visible, "donations.csv")}><Download className="mr-1 h-4 w-4" /> Export CSV</Button>
          <Button onClick={() => {
            const monthRows = visible.map((r: any) => ({ ...r, month: new Date(r.created_at).toISOString().slice(0, 7) }));
            downloadCSV(monthRows, `donations-${month === "all" ? "all" : month}.csv`);
          }}>Monthly Report</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search donor, email, cause..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Donor</th><th className="p-3">Amount</th><th className="p-3">Cause</th><th className="p-3">Method</th><th className="p-3">Status</th><th className="p-3">PAN</th><th className="p-3">Date</th></tr></thead>
            <tbody>
              {visible.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3"><div className="font-medium">{r.donor_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                  <td className="p-3 font-semibold">₹{Number(r.amount).toLocaleString("en-IN")}</td>
                  <td className="p-3">{r.cause || "General"}</td>
                  <td className="p-3">{r.payment_method || "—"}</td>
                  <td className="p-3"><Badge variant={r.status === "completed" ? "default" : "secondary"}>{r.status}</Badge></td>
                  <td className="p-3">{r.pan || "—"}</td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No donations.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
