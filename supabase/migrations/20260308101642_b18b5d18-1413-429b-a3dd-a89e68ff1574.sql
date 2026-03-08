
-- Create wellness assessments table (public submissions, no auth required)
CREATE TABLE public.wellness_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
  sleep_quality TEXT NOT NULL,
  work_life_balance TEXT NOT NULL,
  main_goal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_assessments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit assessments"
  ON public.wellness_assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read (admin only)
CREATE POLICY "Service role can read assessments"
  ON public.wellness_assessments
  FOR SELECT
  TO service_role
  USING (true);
