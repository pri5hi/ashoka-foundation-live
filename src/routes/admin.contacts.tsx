import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/admin-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contacts")({ component: ContactsAdmin });

function ContactsAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [row, setRow] = useState<any>(null);

  const { data: rows } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setRow(null);
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  }

  const visible = (rows || []).filter((r: any) => !search || `${r.name} ${r.email} ${r.subject || ""} ${r.message}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Contact Messages</h1>
          <p className="text-sm text-muted-foreground">{visible.length} messages</p>
        </div>
        <Button variant="outline" onClick={() => downloadCSV(visible, "contacts.csv")}><Download className="mr-1 h-4 w-4" /> Export CSV</Button>
      </div>

      <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left"><tr><th className="p-3">From</th><th className="p-3">Subject</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3"></th></tr></thead>
            <tbody>
              {visible.map((r: any) => (
                <tr key={r.id} className="border-t border-border cursor-pointer hover:bg-secondary/40" onClick={() => { setRow(r); if (r.status === "new") markRead(r.id); }}>
                  <td className="p-3"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                  <td className="p-3">{r.subject || "—"}</td>
                  <td className="p-3"><Badge variant={r.status === "new" ? "default" : "secondary"}>{r.status}</Badge></td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-xs text-primary">View</td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No messages.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!row} onOpenChange={(o) => !o && setRow(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{row?.subject || "Message"}</DialogTitle></DialogHeader>
          {row && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">From:</span> {row.name} &lt;{row.email}&gt;</div>
              {row.phone && <div><span className="text-muted-foreground">Phone:</span> {row.phone}</div>}
              <div className="rounded bg-secondary p-3 whitespace-pre-wrap">{row.message}</div>
              <div className="flex justify-between pt-2">
                <a href={`mailto:${row.email}`} className="text-primary text-sm hover:underline">Reply via email</a>
                <Button variant="destructive" size="sm" onClick={() => remove(row.id)}>Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
