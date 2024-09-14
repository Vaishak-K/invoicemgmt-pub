import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with environment variables
export const supabase = createClient(
  String(process.env.NEXT_PUBLIC_SUPABASE_URL),
  String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);
