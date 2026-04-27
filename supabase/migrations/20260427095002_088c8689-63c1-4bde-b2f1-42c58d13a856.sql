ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;
ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS phone_verified_at timestamptz;

-- Tighten public read policy: must be approved AND phone-verified
DROP POLICY IF EXISTS "Anyone can view approved artisans" ON public.artisans;
CREATE POLICY "Anyone can view verified artisans"
ON public.artisans FOR SELECT
USING (is_approved = true AND phone_verified = true);

-- Tighten public insert: anonymous submissions cannot self-mark verified or approved
DROP POLICY IF EXISTS "Anyone can submit artisan registration" ON public.artisans;
CREATE POLICY "Anyone can submit artisan registration"
ON public.artisans FOR INSERT
TO anon, authenticated
WITH CHECK (is_approved = false AND phone_verified = false);