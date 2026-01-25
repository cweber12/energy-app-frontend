// src/services/itemService.ts
import { 
    Category, 
    UsageType, 
    Item, 
    ElectricalItemForm 
} from "../../types/itemTypes";


/* Item Service
--------------------------------------------------------------------------------
Service functions to interact with the backend API for electrical 
items. 
- addElectricalItem
- fetchItemsByProperty
- fetchItemCategories
- fetchUsageTypes
------------------------------------------------------------------------------*/

/* Add Electrical Item
--------------------------------------------------------------------------------
Params   | propertyId: ID of the property to add the item to.
         | form: ElectricalItemForm object with item details.
--------------------------------------------------------------------------------
Returns  | Response object from the fetch call.
------------------------------------------------------------------------------*/
export async function addElectricalItem(
    propertyId: string, 
    form: ElectricalItemForm
): Promise<Response> {
    const response = await fetch("http://127.0.0.1:5000/electrical_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            property_id: propertyId,
            ...form,
        }),
    });
    return response;
}

/* Fetch Items by Property
--------------------------------------------------------------------------------
Params   | propertyId: ID of the property to fetch items for.
--------------------------------------------------------------------------------
Returns  | Item[] array of item objects.
------------------------------------------------------------------------------*/
export async function fetchItemsByProperty(propertyId: string): Promise<Item[]> {
    const response = await fetch(`http://127.0.0.1:5000/electrical_items/property/${propertyId}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    return data;
}

/* Fetch Item Categories
--------------------------------------------------------------------------------
Returns  | Category[] array of category objects.
------------------------------------------------------------------------------*/
export async function fetchItemCategories(): Promise<{ [key: number]: string }> {
    const response = await fetch(`http://127.0.0.1:5000/item_categories`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    const categoryMap: { [key: number]: string } = {};
    data.forEach((cat: Category) => {
        categoryMap[cat.category_id] = cat.category_name;
    });
    return categoryMap;
}

/* Fetch Usage Types
--------------------------------------------------------------------------------
Returns  | UsageType[] array of usage type objects.
------------------------------------------------------------------------------*/
export async function fetchUsageTypes(): Promise<{ [key: number]: string }> {
    const response = await fetch(`http://127.0.0.1:5000/usage_types`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    const categoryMap: { [key: number]: string } = {};
    data.forEach((ut: UsageType) => {
        categoryMap[ut.usage_type_id] = ut.usage_type_name;
    });
    return categoryMap;
}