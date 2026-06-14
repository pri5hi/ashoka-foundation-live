
-- 1) Restrict site_settings public reads to exclude sensitive bank/upi keys
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read non-sensitive site settings"
ON public.site_settings
FOR SELECT
USING (key NOT IN ('bank', 'upi'));

-- 2) user_roles: explicit admin-only INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Admins insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins delete roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3) Restrict help-documents bucket uploads to a 'help/' prefix
DROP POLICY IF EXISTS "Anyone upload help-documents" ON storage.objects;
CREATE POLICY "Public upload help-documents in help folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'help-documents'
  AND (storage.foldername(name))[1] = 'help'
);
