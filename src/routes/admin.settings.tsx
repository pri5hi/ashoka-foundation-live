import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/admin-utils";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*")).data || [],
  });

  const [state, setState] = useState<Record<string, any>>({});
  useEffect(() => {
    if (rows) {
      const m: Record<string, any> = {};
      rows.forEach((r: any) => (m[r.key] = r.value));
      setState(m);
    }
  }, [rows]);

  async function save(key: string) {
    const { error } = await supabase.from("site_settings").update({ value: state[key] }).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
  }

  function upd(key: string, field: string, value: any) {
    setState((s) => ({ ...s, [key]: { ...s[key], [field]: value } }));
  }

  async function uploadQR(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = await uploadMedia(f, "settings");
    if (url) upd("upi", "qr_url", url);
  }

  if (!rows) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage organization details visible across the website.</p>
      </div>

      {/* NGO Details */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">NGO Details</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Name</Label><Input value={state.ngo?.name || ""} onChange={(e) => upd("ngo", "name", e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={state.ngo?.tagline || ""} onChange={(e) => upd("ngo", "tagline", e.target.value)} /></div>
          <div><Label>Registration No.</Label><Input value={state.ngo?.registration || ""} onChange={(e) => upd("ngo", "registration", e.target.value)} /></div>
          <div><Label>Established</Label><Input value={state.ngo?.established || ""} onChange={(e) => upd("ngo", "established", e.target.value)} /></div>
        </div>
        <div><Label>About</Label><Textarea rows={3} value={state.ngo?.about || ""} onChange={(e) => upd("ngo", "about", e.target.value)} /></div>
        <Button onClick={() => save("ngo")}>Save NGO Details</Button>
      </Card>

      {/* Contact */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Contact Information</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Email</Label><Input value={state.contact?.email || ""} onChange={(e) => upd("contact", "email", e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={state.contact?.phone || ""} onChange={(e) => upd("contact", "phone", e.target.value)} /></div>
          <div><Label>WhatsApp</Label><Input value={state.contact?.whatsapp || ""} onChange={(e) => upd("contact", "whatsapp", e.target.value)} /></div>
          <div><Label>Address</Label><Input value={state.contact?.address || ""} onChange={(e) => upd("contact", "address", e.target.value)} /></div>
        </div>
        <Button onClick={() => save("contact")}>Save Contact</Button>
      </Card>

      {/* Social */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Social Media Links</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {["facebook", "instagram", "twitter", "youtube", "linkedin"].map((k) => (
            <div key={k}><Label className="capitalize">{k}</Label><Input value={state.social?.[k] || ""} onChange={(e) => upd("social", k, e.target.value)} /></div>
          ))}
        </div>
        <Button onClick={() => save("social")}>Save Social Links</Button>
      </Card>

      {/* Bank */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Bank Details</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Account Name</Label><Input value={state.bank?.account_name || ""} onChange={(e) => upd("bank", "account_name", e.target.value)} /></div>
          <div><Label>Account Number</Label><Input value={state.bank?.account_number || ""} onChange={(e) => upd("bank", "account_number", e.target.value)} /></div>
          <div><Label>IFSC</Label><Input value={state.bank?.ifsc || ""} onChange={(e) => upd("bank", "ifsc", e.target.value)} /></div>
          <div><Label>Bank</Label><Input value={state.bank?.bank || ""} onChange={(e) => upd("bank", "bank", e.target.value)} /></div>
          <div><Label>Branch</Label><Input value={state.bank?.branch || ""} onChange={(e) => upd("bank", "branch", e.target.value)} /></div>
        </div>
        <Button onClick={() => save("bank")}>Save Bank Details</Button>
      </Card>

      {/* UPI */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">UPI Details</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>UPI ID</Label><Input value={state.upi?.id || ""} onChange={(e) => upd("upi", "id", e.target.value)} /></div>
          <div>
            <Label>QR Code Image</Label>
            <div className="flex items-center gap-3">
              <Input type="file" accept="image/*" onChange={uploadQR} />
              {state.upi?.qr_url && <img src={state.upi.qr_url} alt="QR" className="h-12 w-12 rounded object-cover" />}
            </div>
          </div>
        </div>
        <Button onClick={() => save("upi")}>Save UPI</Button>
      </Card>

      {/* Footer */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Footer Content</h3>
        <div><Label>Description</Label><Textarea rows={2} value={state.footer?.description || ""} onChange={(e) => upd("footer", "description", e.target.value)} /></div>
        <div><Label>Copyright</Label><Input value={state.footer?.copyright || ""} onChange={(e) => upd("footer", "copyright", e.target.value)} /></div>
        <Button onClick={() => save("footer")}>Save Footer</Button>
      </Card>
    </div>
  );
}
