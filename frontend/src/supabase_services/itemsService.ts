// frontend/src/supabase_services/itemsService.ts
import type { Category, UsageType, Item, ElectricalItemForm } from "../../types/itemTypes";
import { supabase } from "../lib/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

/* Helper function to perform authenticated fetch requests to Supabase Functions
--------------------------------------------------------------------------------
Params  | path: string endpoint path
        | method: "GET" | "POST" | "PUT" | "DELETE" HTTP method
        | body?: unknown optional request body
--------------------------------------------------------------------------------
Returns | T generic type of the response data
------------------------------------------------------------------------------*/
async function authedFetch<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;

  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    apikey: SUPABASE_ANON_KEY,
  };

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
  const res = await fetch(`${SUPABASE_URL}/functions/v1/items${path}`, fetchOptions);

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? json?.message ?? `Request failed (${res.status})`);
  return json as T;
}

/* Add a new electrical item to a property
--------------------------------------------------------------------------------
Params  | propertyId: string ID of the property
        | form: ElectricalItemForm form data for the new item
--------------------------------------------------------------------------------
Returns | { item_id: number } object with the new item's ID
------------------------------------------------------------------------------*/
export async function addElectricalItem(
  propertyId: string,
  form: ElectricalItemForm,
): Promise<{ item_id: number }> {
  return authedFetch<{ item_id: number }>("", "POST", {
    property_id: Number(propertyId),
    ...form,
  });
}

/* Fetch all items for a given property
--------------------------------------------------------------------------------
Params  | propertyId: string ID of the property
--------------------------------------------------------------------------------
Returns | Item[] array of items for the property
------------------------------------------------------------------------------*/
export async function fetchItemsByProperty(propertyId: string): Promise<Item[]> {
  const data = await authedFetch<Item[]>(`/property/${propertyId}`, "GET");
  if (!Array.isArray(data)) throw new Error("Unexpected response");
  return data;
}

/* Fetch all item categories
--------------------------------------------------------------------------------
Returns | { [key: number]: string } mapping of category IDs to names
------------------------------------------------------------------------------*/
export async function fetchItemCategories(): Promise<{ [key: number]: string }> {
  const { data, error } = await supabase
    .from("item_category")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  const categoryMap: { [key: number]: string } = {};
  (data ?? []).forEach((cat: any) => {
    categoryMap[cat.id] = cat.name;
  });
  return categoryMap;
}

/* Fetch all usage types
--------------------------------------------------------------------------------
Returns | { [key: number]: string } mapping of usage type IDs to names
------------------------------------------------------------------------------*/
export async function fetchUsageTypes(): Promise<{ [key: number]: string }> {
  const { data, error } = await supabase
    .from("usage_type")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  const usageMap: { [key: number]: string } = {};
  (data ?? []).forEach((ut: any) => {
    usageMap[ut.id] = ut.name;
  });
  return usageMap;
}