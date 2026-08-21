CREATE POLICY "family_visuals_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'family-visuals' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "family_visuals_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'family-visuals' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "family_visuals_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'family-visuals' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'family-visuals' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "family_visuals_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'family-visuals' AND (storage.foldername(name))[1] = auth.uid()::text);