import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Upload, Star } from "lucide-react";
import { uploadMedia } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdmin });

const CATEGORIES = ["UDAAN", "SWABHIMAAN", "ANN SE ASHIRWAD", "HAR JEEVAN ANMOL", "VASUNDHARA"];

function GalleryAdmin() {
  const qc = useQueryClient();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const { data: rows } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => (await supabase.from("gallery").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false })).data || [],
  });

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files; if (!files?.length) return;
    setUploading(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      const url = await uploadMedia(f, "gallery");
      if (!url) continue;
      const isVideo = f.type.startsWith("video");
      const { error } = await supabase.from("gallery").insert({
        image_url: url, category, title: title || null, caption: caption || null,
        media_type: isVideo ? "video" : "image", is_published: true,
      });
      if (!error) ok++;
    }
    setUploading(false);
    toast.success(`${ok} item(s) uploaded`);
    setTitle(""); setCaption("");
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    (e.target as HTMLInputElement).value = "";
  }

  async function remove(id: string) {
    if (!confirm("Delete this media?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }

  async function toggleFeatured(r: any) {
    await supabase.from("gallery").update({ is_featured: !r.is_featured }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }

  async function setOrder(r: any, delta: number) {
    await supabase.from("gallery").update({ display_order: (r.display_order || 0) + delta }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }

  const visible = (rows || []).filter((r: any) => filter === "all" || r.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Gallery</h1>
        <p className="text-sm text-muted-foreground">Upload images and videos. Set categories and featured items.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Upload Media</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <div><Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Title (optional)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Caption (optional)</Label><Input value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
        </div>
        <div>
          <Label className="mb-2 block">Files (images / videos, multiple supported)</Label>
          <Input type="file" multiple accept="image/*,video/*" onChange={onUpload} disabled={uploading} />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Label>Filter:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((r: any) => (
          <Card key={r.id} className="overflow-hidden">
            {r.media_type === "video" ? (
              <video src={r.image_url} className="h-40 w-full object-cover" controls />
            ) : (
              <img src={r.image_url} alt={r.title || ""} className="h-40 w-full object-cover" />
            )}
            <div className="p-3 space-y-2">
              <div className="text-xs text-muted-foreground">{r.category}</div>
              {r.title && <div className="text-sm font-medium truncate">{r.title}</div>}
              <div className="flex items-center justify-between">
                <button onClick={() => toggleFeatured(r)} className={`inline-flex items-center gap-1 text-xs ${r.is_featured ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                  <Star className="h-3.5 w-3.5" fill={r.is_featured ? "currentColor" : "none"} /> {r.is_featured ? "Featured" : "Feature"}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => setOrder(r, -1)} className="rounded border px-1.5 text-xs">↑</button>
                  <button onClick={() => setOrder(r, 1)} className="rounded border px-1.5 text-xs">↓</button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!visible.length && <Card className="col-span-full p-10 text-center text-muted-foreground">No media yet.</Card>}
      </div>
    </div>
  );
}
