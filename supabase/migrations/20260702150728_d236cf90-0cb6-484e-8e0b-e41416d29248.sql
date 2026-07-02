
-- Tighten permissive INSERT policies
DROP POLICY IF EXISTS "Anyone can send message" ON public.contact_messages;
CREATE POLICY "Anyone can send message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (status IS NULL OR status = 'new')
    AND length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND length(message) BETWEEN 1 AND 5000
  );

DROP POLICY IF EXISTS "Anyone can record donation" ON public.donations;
CREATE POLICY "Anyone can record donation" ON public.donations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (status IS NULL OR status = 'pending')
    AND reference_id IS NULL
    AND amount > 0
    AND length(donor_name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
  );

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (is_active IS NULL OR is_active = true)
    AND length(email) BETWEEN 3 AND 320
  );

DROP POLICY IF EXISTS "Anyone can apply as volunteer" ON public.volunteers;
CREATE POLICY "Anyone can apply as volunteer" ON public.volunteers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (status IS NULL OR status = 'pending')
    AND length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND length(phone) BETWEEN 3 AND 40
    AND length(city) BETWEEN 1 AND 120
  );

-- Private schema for has_role
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate all dependent policies
DROP POLICY IF EXISTS "Admins manage blogs" ON public.blogs;
CREATE POLICY "Admins manage blogs" ON public.blogs FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public read published blogs" ON public.blogs;
CREATE POLICY "Public read published blogs" ON public.blogs FOR SELECT TO anon, authenticated
  USING (is_published = true OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete messages" ON public.contact_messages;
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update messages" ON public.contact_messages;
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins view messages" ON public.contact_messages;
CREATE POLICY "Admins view messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete donations" ON public.donations;
CREATE POLICY "Admins delete donations" ON public.donations FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update donations" ON public.donations;
CREATE POLICY "Admins update donations" ON public.donations FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins view donations" ON public.donations;
CREATE POLICY "Admins view donations" ON public.donations FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage gallery" ON public.gallery;
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public read published gallery" ON public.gallery;
CREATE POLICY "Public read published gallery" ON public.gallery FOR SELECT TO anon, authenticated
  USING (is_published = true OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage impact stats" ON public.impact_stats;
CREATE POLICY "Admins manage impact stats" ON public.impact_stats FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT TO anon, authenticated
  USING (is_published = true OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public read published testimonials" ON public.testimonials;
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated
  USING (is_published = true OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete volunteers" ON public.volunteers;
CREATE POLICY "Admins delete volunteers" ON public.volunteers FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage volunteers" ON public.volunteers;
CREATE POLICY "Admins manage volunteers" ON public.volunteers FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins view volunteers" ON public.volunteers;
CREATE POLICY "Admins view volunteers" ON public.volunteers FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- Storage policies for cms-media bucket
DROP POLICY IF EXISTS "Admins upload cms-media" ON storage.objects;
CREATE POLICY "Admins upload cms-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update cms-media" ON storage.objects;
CREATE POLICY "Admins update cms-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-media' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete cms-media" ON storage.objects;
CREATE POLICY "Admins delete cms-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms-media' AND private.has_role(auth.uid(), 'admin'));

-- Remove the public-schema has_role now
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
