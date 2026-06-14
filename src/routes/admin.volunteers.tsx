import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Check, X } from "lucide-react";
import { downloadCSV } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/volunteers")({ component: VolunteersAdmin });

function VolunteersAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data: rows } = useQuery({
    queryKey: ["admin-volunteers"],
    queryFn: async () => (await supabase.from("volunteers").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function setRowStatus(id: string, s: string) {
    const { error } = await supabase.from("volunteers").update({ status: s }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-volunteers"] });
  }

  const visible = (rows || []).filter((r: any) =>
    (status === "all" || r.status === status) &&
    (!search || `${r.name} ${r.email} ${r.city}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Volunteer Applications</h1>
          <p className="text-sm text-muted-foreground">{visible.length} of {rows?.length || 0} applications</p>
        </div>
        <Button variant="outline" onClick={() => downloadCSV(visible, "volunteers.csv")}>
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search name, email, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">City</th><th className="p-3">Skills</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {visible.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3"><div>{r.email}</div><div className="text-xs text-muted-foreground">{r.phone}</div></td>
                  <td className="p-3">{r.city}</td>
                  <td className="p-3 max-w-xs truncate">{r.skills}</td>
                  <td className="p-3"><Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge></td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right space-x-1">
                    <Button size="sm" variant="outline" onClick={() => setRowStatus(r.id, "approved")}><Check className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setRowStatus(r.id, "rejected")}><X className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No applications.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
