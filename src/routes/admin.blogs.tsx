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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { uploadMedia } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/blogs")({ component: BlogsAdmin });

const empty: any = {
  title: "", slug: "", category: "News", excerpt: "", content: "", cover_image_url: "",
  author_name: "Foundation Team", is_published: false, seo_title: "", seo_description: "",
};

function BlogsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(empty);
  const [uploading, setUploading] = useState(false);

  const { data: rows } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => (await supabase.from("blogs").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function save(publish?: boolean) {
    if (!editing.title || !editing.slug) return toast.error("Title and slug required");
    const payload = { ...editing };
    if (publish !== undefined) payload.is_published = publish;
    if (payload.is_published && !payload.published_at) payload.published_at = new Date().toISOString();
    const { error } = editing.id
      ? await supabase.from("blogs").update(payload).eq("id", editing.id)
      : await supabase.from("blogs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(payload.is_published ? "Published" : "Saved as draft");
    setOpen(false); setEditing(empty);
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadMedia(f, "blogs");
    setUploading(false);
    if (url) setEditing({ ...editing, cover_image_url: url });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">News & Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Create, edit and publish announcements and stories.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
          <DialogTrigger asChild><Button onClick={() => setEditing(empty)}><Plus className="mr-1 h-4 w-4" /> New Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing.id ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Author</Label><Input value={editing.author_name || ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></div>
              </div>
              <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
              <div><Label>Content (Markdown / HTML)</Label><Textarea rows={8} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
              <div>
                <Label>Featured Image</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
                  {editing.cover_image_url && <img src={editing.cover_image_url} alt="" className="h-12 w-12 rounded object-cover" />}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label>SEO Title</Label><Input value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} /></div>
                <div><Label>Meta Description</Label><Input value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <Label>Published</Label>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => save(false)}>Save Draft</Button>
              <Button onClick={() => save(true)}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Author</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {(rows || []).map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.author_name}</td>
                  <td className="p-3"><Badge variant={r.is_published ? "default" : "secondary"}>{r.is_published ? "Published" : "Draft"}</Badge></td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {!rows?.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
