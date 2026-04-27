// frontend/src/lib/apiFetch.ts
import { supabase } from "./supabaseClient";
import { SUPABASE_ANON_KEY } from "../config/supabase";

const FETCH_TIMEOUT_MS = 10_000;

/* Authenticated fetch wrapper for Supabase Edge Functions
--------------------------------------------------------------------------------
Params  | url: string   Full URL of the Edge Function endpoint
        | method:       HTTP verb (default "GET")
        | body?:        Request payload (serialised to JSON when present)
--------------------------------------------------------------------------------
Returns | T Parsed JSON response body
Throws  | "Not authenticated" when no active session exists
        | API error message when the response is not ok
        | AbortError when the request exceeds FETCH_TIMEOUT_MS
------------------------------------------------------------------------------*/
export async function authedFetch<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
): Promise<T> {
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;

  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const hasBody = body !== undefined && method !== "GET" && method !== "DELETE";

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new Error("Request timed out")),
    FETCH_TIMEOUT_MS,
  );

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      ...(hasBody ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error ?? json?.message ?? `Request failed (${res.status})`);
    return json as T;
  } finally {
    clearTimeout(timeout);
  }
}
