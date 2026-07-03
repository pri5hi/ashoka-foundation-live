ALTER TABLE public.contact_messages ALTER COLUMN status SET DEFAULT 'new';

DROP POLICY IF EXISTS "Anyone can send message" ON public.contact_messages;
CREATE POLICY "Anyone can send message"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (status IS NULL OR status IN ('new', 'unread'))
  AND length(name) >= 1 AND length(name) <= 200
  AND length(email) >= 3 AND length(email) <= 320
  AND length(message) >= 1 AND length(message) <= 5000
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;