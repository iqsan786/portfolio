-- Enable anonymous INSERT on portfolio_inquiries (write-only: no visitor read path)
-- Apply this in Supabase SQL editor: https://supabase.com/dashboard/project/ucopegbdcoczdjgkzhch/sql

-- Make sure RLS is enabled
ALTER TABLE public.portfolio_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated visitors) to insert inquiries
CREATE POLICY "allow_anon_insert"
  ON public.portfolio_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Block all reads for anon (private — only you can view via dashboard)
-- (no SELECT policy means anon cannot read)
