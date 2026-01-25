// src/services/authService.ts
import { supabase } from "../lib/supabaseClient";
import { RegisterResult } from "../../types/authTypes";

/* Register with Supabase
--------------------------------------------------------------------------------
Params   | email: User's email address.
         | password: User's password.
         | username: User's chosen username (or "").
--------------------------------------------------------------------------------
Returns  | RegisterResult object with registration details.
------------------------------------------------------------------------------*/
export async function registerWithSupabase(
  email: string,
  password: string,
  username: string
): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  return {
    userId: data.user?.id ?? null,
    email: data.user?.email ?? null,
    sessionExists: !!data.session,
    errorMessage: error?.message ?? null,
  };
}

/* Login with Supabase
--------------------------------------------------------------------------------
Params   | email: User's email address (string)
         | password: User's password (string)
--------------------------------------------------------------------------------
Returns  | Object with user email, username, user_id, and error (if any).
------------------------------------------------------------------------------*/
export async function loginWithSupabase(email: string, password: string) {
    const { data, error } = 
        await supabase.auth.signInWithPassword({ email, password });
    return {
        email: data.user?.email ?? null,
        username: data.user?.user_metadata?.username ?? null,
        user_id: data.user?.id ?? null,
        error,
    };
}