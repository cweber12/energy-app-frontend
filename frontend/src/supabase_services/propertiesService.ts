// frontend/src/supabase_services/propertiesService.ts
import type { Property, PropertyForm } from "../../types/propertyTypes";
import { SUPABASE_URL } from "../config/supabase";
import { authedFetch } from "../lib/apiFetch";

const BASE = `${SUPABASE_URL}/functions/v1/properties`;

/* Add a new property
--------------------------------------------------------------------------------
Params  | form: PropertyForm form data for the new property
--------------------------------------------------------------------------------
Returns | { property_id: number } object with the new property's ID
------------------------------------------------------------------------------*/
export async function addProperty(form: PropertyForm): Promise<{ property_id: number }> {
  return authedFetch<{ property_id: number }>(BASE, "POST", form);
}

/* Fetch all properties for the authenticated user
--------------------------------------------------------------------------------
Returns | Property[] array of properties
------------------------------------------------------------------------------*/
export async function fetchMyProperties(): Promise<Property[]> {
  return authedFetch<Property[]>(BASE);
}
