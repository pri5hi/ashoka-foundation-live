import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { uploadMedia } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

type Project = any;

const empty: Project = {
  title: "", slug: "", category: "Education", status: "ongoing", location: "",
  summary: "", description: "", objectives: "", beneficiaries: 0,
  start_date: null, end_date: null, image_url: "", is_published: true,
};

function ProjectsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project>(empty);
  const [uploading, setUploading] = useState(false);

  const { data: rows } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function save() {
    if (!editing.title || !editing.slug) return toast.error("Title and slug required");
    const payload = { ...editing, beneficiaries: Number(editing.beneficiaries) || 0 };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Project saved");
    setOpen(false); setEditing(empty);
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadMedia(f, "projects");
    setUploading(false);
    if (url) setEditing({ ...editing, image_url: url });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">Add, edit and publish foundation projects.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(empty)}><Plus className="mr-1 h-4 w-4" /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing.id ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                <div><Label>Category</Label>
                  <Select value={editing.category || "Education"} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Education", "Food Drives", "Health", "Women Empowerment", "Relief Work", "Community"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["ongoing", "completed", "upcoming"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Location</Label><Input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
                <div><Label>Beneficiaries</Label><Input type="number" value={editing.beneficiaries || 0} onChange={(e) => setEditing({ ...editing, beneficiaries: e.target.value })} /></div>
                <div><Label>Start Date</Label><Input type="date" value={editing.start_date || ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value || null })} /></div>
                <div><Label>End Date</Label><Input type="date" value={editing.end_date || ""} onChange={(e) => setEditing({ ...editing, end_date: e.target.value || null })} /></div>
              </div>
              <div><Label>Summary</Label><Textarea rows={2} value={editing.summary || ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><Label>Objectives</Label><Textarea rows={3} value={editing.objectives || ""} onChange={(e) => setEditing({ ...editing, objectives: e.target.value })} /></div>
              <div>
                <Label>Cover Image</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
                  {editing.image_url && <img src={editing.image_url} alt="" className="h-12 w-12 rounded object-cover" />}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <Label>Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Beneficiaries</th><th className="p-3">Published</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {(rows || []).map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3"><Badge variant="secondary">{r.status}</Badge></td>
                  <td className="p-3">{r.beneficiaries?.toLocaleString("en-IN") || 0}</td>
                  <td className="p-3">{r.is_published ? "Yes" : "Draft"}</td>
                  <td className="p-3 text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {!rows?.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No projects yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
