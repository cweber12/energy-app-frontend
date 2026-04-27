// frontend/src/supabase_services/itemsService.ts
import type { Item, ElectricalItemForm } from "../../types/itemTypes";
import { supabase } from "../lib/supabaseClient";
import { SUPABASE_URL } from "../config/supabase";
import { authedFetch } from "../lib/apiFetch";

const BASE = `${SUPABASE_URL}/functions/v1/items`;

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
  return authedFetch<{ item_id: number }>(BASE, "POST", {
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
  const data = await authedFetch<Item[]>(`${BASE}/property/${propertyId}`);
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
