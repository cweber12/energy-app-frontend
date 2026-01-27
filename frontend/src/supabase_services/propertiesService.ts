// frontend/src/supabase_services/propertiesService.ts
import type { Property, PropertyForm } from "../../types/propertyTypes";
import { supabase } from "../lib/supabaseClient";
import { SUPABASE_URL } from "../config/supabase";

/* Helper function to perform authenticated fetch requests to Supabase Functions
--------------------------------------------------------------------------------
Params  | path: string endpoint path
        | method: "GET" | "POST" | "PUT" | "DELETE" HTTP method
        | body?: unknown optional request body
--------------------------------------------------------------------------------
Returns | T generic type of the response data
------------------------------------------------------------------------------*/
async function callPropertiesFn<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T> {
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;

  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const url = `${SUPABASE_URL}/functions/v1/properties${path}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  // Only set JSON content-type if we are actually sending a body
  const hasBody = body !== undefined && method !== "GET" && method !== "DELETE";
  if (hasBody) headers["Content-Type"] = "application/json";

  const fetchOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) as BodyInit : null, // <-- changed undefined to null
    };

  const res = await fetch(url, fetchOptions);

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error ?? json?.message ?? `Request failed (${res.status})`);
  }
  return json as T;
}

/* Add a new property
--------------------------------------------------------------------------------
Params  | form: PropertyForm form data for the new property
--------------------------------------------------------------------------------
Returns | { property_id: number } object with the new property's ID
------------------------------------------------------------------------------*/
export async function addProperty(form: PropertyForm): Promise<{ property_id: number }> {
  return callPropertiesFn<{ property_id: number }>("", "POST", form);
}

/* Fetch all properties for the authenticated user
--------------------------------------------------------------------------------
Returns | Property[] array of properties
------------------------------------------------------------------------------*/
export async function fetchMyProperties(): Promise<Property[]> {
  return callPropertiesFn<Property[]>("", "GET");
}