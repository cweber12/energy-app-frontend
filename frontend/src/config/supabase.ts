export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY");
}

export const SUPABASE_FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;