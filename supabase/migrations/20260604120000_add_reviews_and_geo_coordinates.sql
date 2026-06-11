-- Add latitude and longitude columns for geographic (mobile/Leaflet) mapping
ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.artisans ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous guests) to view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Allow anyone to submit reviews
CREATE POLICY "Anyone can submit reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Trigger function to automatically recalculate and update average rating of the artisan
CREATE OR REPLACE FUNCTION public.update_artisan_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_artisan_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_artisan_id := OLD.artisan_id;
  ELSE
    target_artisan_id := NEW.artisan_id;
  END IF;

  UPDATE public.artisans
  SET rating = (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM public.reviews
    WHERE artisan_id = target_artisan_id
  )
  WHERE id = target_artisan_id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute average rating updates on review insert, update, or delete
CREATE OR REPLACE TRIGGER reviews_update_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_artisan_rating();
