
-- =========================
-- TESTIMONIALS
-- =========================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  location text,
  message text NOT NULL,
  photo_url text,
  rating int DEFAULT 5,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- SITE SETTINGS (key/value JSON)
-- =========================
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('ngo', '{"name":"Creative Ashoka Foundation","tagline":"Serving Humanity, Creating Hope.","registration":"","established":"","about":""}'::jsonb),
  ('contact', '{"email":"info@creativeashoka.org","phone":"+91 00000 00000","whatsapp":"+910000000000","address":"India"}'::jsonb),
  ('social', '{"facebook":"","instagram":"","twitter":"","youtube":"","linkedin":""}'::jsonb),
  ('bank', '{"account_name":"Creative Ashoka Foundation","account_number":"","ifsc":"","bank":"","branch":""}'::jsonb),
  ('upi', '{"id":"","qr_url":""}'::jsonb),
  ('footer', '{"copyright":"© Creative Ashoka Foundation","description":"Serving humanity through education, food, health and relief programs across India."}'::jsonb);

-- =========================
-- IMPACT STATS
-- =========================
CREATE TABLE public.impact_stats (
  key text PRIMARY KEY,
  label text NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  suffix text DEFAULT '+',
  display_order int DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.impact_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT ALL ON public.impact_stats TO service_role;

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read impact stats" ON public.impact_stats
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage impact stats" ON public.impact_stats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_impact_stats_updated_at BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.impact_stats (key, label, value, suffix, display_order) VALUES
  ('lives_impacted', 'Lives Impacted', 25000, '+', 1),
  ('projects_completed', 'Projects Completed', 120, '+', 2),
  ('volunteers', 'Volunteers', 850, '+', 3),
  ('cities_reached', 'Cities Reached', 42, '+', 4),
  ('donations_received', 'Donations Received', 5000000, '+', 5);

-- =========================
-- EXTEND EXISTING TABLES
-- =========================
ALTER TABLE public.help_requests
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS document_urls jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS assigned_to uuid;

ALTER TABLE public.gallery
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS display_order int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS objectives text,
  ADD COLUMN IF NOT EXISTS impact_stats jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- Add update policies for volunteers/help_requests by admin already exist.

-- Allow public to read projects/blogs/gallery (already in place). Good.
