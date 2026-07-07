import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "cms-media";
const SIGN_TTL = 60 * 60; // 1 hour

export async function uploadMedia(file: File, folder = "uploads"): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    toast.error("Upload failed: " + error.message);
    return null;
  }
  // Bucket is private — store the storage path itself; callers sign on read.
  return path;
}

/**
 * Resolve a stored `image_url` value (either a storage path in the private
 * cms-media bucket, or a legacy absolute URL) to a URL usable in <img>/<video>.
 * Signs private-bucket paths on demand so the public site always gets a fresh URL.
 */
export async function resolveMediaUrls(values: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const toSign: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (/^https?:\/\//i.test(v)) {
      // Legacy signed/public URL previously stored in DB — pass through.
      map[v] = v;
    } else {
      toSign.push(v);
    }
  }
  if (toSign.length) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(toSign, SIGN_TTL);
    if (!error && data) {
  for (const item of data) {
    console.log("Signed URL item:", item);

    if (item.path && item.signedUrl) {
      map[item.path] = item.signedUrl.startsWith("http")
        ? item.signedUrl
        : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1${item.signedUrl}`;
    }
  }
}
  }
  return map;
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
