import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { uploadMedia } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

const empty: any = { name: "", role: "", location: "", message: "", photo_url: "", rating: 5, is_featured: false, is_published: true };

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(empty);
  const [uploading, setUploading] = useState(false);

  const { data: rows } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function save() {
    if (!editing.name || !editing.message) return toast.error("Name and message required");
    const { error } = editing.id
      ? await supabase.from("testimonials").update(editing).eq("id", editing.id)
      : await supabase.from("testimonials").insert(editing);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false); setEditing(empty);
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadMedia(f, "testimonials");
    setUploading(false);
    if (url) setEditing({ ...editing, photo_url: url });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Stories from beneficiaries, volunteers and donors.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
          <DialogTrigger asChild><Button onClick={() => setEditing(empty)}><Plus className="mr-1 h-4 w-4" /> New</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing.id ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Role</Label><Input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
                <div><Label>Location</Label><Input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
                <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Message</Label><Textarea rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} /></div>
              <div>
                <Label>Photo</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
                  {editing.photo_url && <img src={editing.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2"><Switch checked={editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} /> Featured</label>
                <label className="flex items-center gap-2"><Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /> Published</label>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(rows || []).map((r: any) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start gap-3">
              {r.photo_url ? <img src={r.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-secondary" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><div className="font-semibold truncate">{r.name}</div>{r.is_featured && <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" />}</div>
                <div className="text-xs text-muted-foreground">{r.role} {r.location && `· ${r.location}`}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-4">"{r.message}"</p>
            <div className="mt-3 flex justify-end gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
        {!rows?.length && <Card className="col-span-full p-10 text-center text-muted-foreground">No testimonials yet.</Card>}
      </div>
    </div>
  );
}
