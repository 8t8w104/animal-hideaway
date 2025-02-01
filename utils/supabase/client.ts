import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
