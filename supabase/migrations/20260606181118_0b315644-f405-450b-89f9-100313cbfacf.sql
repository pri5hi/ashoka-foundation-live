
-- cms-media: public read, admin write
CREATE POLICY "Public read cms-media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-media');

CREATE POLICY "Admins upload cms-media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update cms-media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete cms-media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

-- help-documents: anyone can upload, only admins can read/manage
CREATE POLICY "Anyone upload help-documents" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'help-documents');

CREATE POLICY "Admins read help-documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'help-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete help-documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'help-documents' AND public.has_role(auth.uid(), 'admin'));
