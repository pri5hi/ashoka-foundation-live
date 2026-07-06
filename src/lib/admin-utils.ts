import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "cms-media";

export async function uploadMedia(file: File, folder = "uploads"): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    toast.error("Upload failed: " + error.message);
    return null;
  }
  // Bucket is private (workspace blocks public buckets), so mint a long-lived signed URL.
  const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
  const { data: signed, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
  if (signErr || !signed?.signedUrl) {
    toast.error("Could not generate media URL: " + (signErr?.message || "unknown"));
    return null;
  }
  return signed.signedUrl;
}

export function downloadCSV(rows: Record<string, any>[], filename: string) {
  if (!rows.length) {
    toast.info("No data to export");
    return;
  }
  const cols = Object.keys(rows[0]);
  const esc = (v: any) => {
    if (v == null) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
