-- Add approval workflow for artisans
ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;
ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS submitted_by_email text;

-- Update public read policy to only show approved artisans
DROP POLICY IF EXISTS "Anyone can view artisans" ON public.artisans;
CREATE POLICY "Anyone can view approved artisans"
ON public.artisans FOR SELECT
USING (is_approved = true);

-- Allow anyone (including anon) to submit a new artisan registration (always unapproved)
CREATE POLICY "Anyone can submit artisan registration"
ON public.artisans FOR INSERT
TO anon, authenticated
WITH CHECK (is_approved = false);

-- Remove all fake seeded artisans
DELETE FROM public.artisans;