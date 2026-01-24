import { CategoryType, UsageType, ItemType } from "../hooks/useElectricalItems";

type ElectricalItemForm = {
    category_id: number;
    usage_type_id: number;
    nickname: string;
    rated_watts: number;
};

export async function addElectricalItem(propertyId: string, form: ElectricalItemForm) {
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

export async function fetchItemsByProperty(propertyId: string): Promise<ItemType[]> {
    const response = await fetch(`http://127.0.0.1:5000/electrical_items/property/${propertyId}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    return data;
}

export async function fetchItemCategories(): Promise<{ [key: number]: string }> {
    const response = await fetch(`http://127.0.0.1:5000/item_categories`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    const categoryMap: { [key: number]: string } = {};
    data.forEach((cat: CategoryType) => {
        categoryMap[cat.category_id] = cat.category_name;
    });
    return categoryMap;
}

export async function fetchUsageTypes(): Promise<{ [key: number]: string }> {
    const response = await fetch(`http://127.0.0.1:5000/usage_types`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    const usageTypeMap: { [key: number]: string } = {};
    data.forEach((ut: UsageType) => {
        usageTypeMap[ut.usage_type_id] = ut.usage_type_name;
    });
    return usageTypeMap;
}