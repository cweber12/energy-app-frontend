// src/hooks/useElectricalItems.ts
import { useState, useEffect } from "react";

// Type definition for category mapping (1 -> "HVAC", etc.)
type CategoryType = {
    category_id: number;
    category_name: string;
};

// Type definition for usage type mapping (1 -> "Intermittent", etc.)
type UsageType = {
    usage_type_id: number;
    usage_type_name: string;
};

// Type definition for electrical item
type ItemType = {
    item_id: number; 
    nickname: string; 
    category_id: number; 
    usage_type_id: number; 
    rated_watts: number; 
};

/* Fetch Electrical Items Hook
--------------------------------------------------------------------------------
Description: Fetches electrical items associated with a property ID, along with
their categories and usage types.
Params:
    - propertyId: ID of the property to fetch items for.
Returns:
    - items: List of electrical items (ItemType).
    - categories: Mapping of category IDs to category names (CategoryType).
    - usageTypes: Mapping of usage type IDs to usage type names (UsageType).
------------------------------------------------------------------------------*/
export function useElectricalItems(propertyId: string) {
    const [items, setItems] = useState<ItemType[]>([]);
    const [categories, setCategories] = useState<{ [key: number]: string }>({});
    const [usageTypes, setUsageTypes] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        if (!propertyId) return;

        fetch(`http://127.0.0.1:5000/electrical_items/property/${propertyId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    setItems([]);
                    console.error("Unexpected response:", data);
                }
            })
            .catch((error) => {
                setItems([]);
                console.error("Error fetching items:", error);
            });

        fetch(`http://127.0.0.1:5000/item_categories`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const categoryMap: { [key: number]: string } = {};
                    data.forEach((cat: CategoryType) => {
                        categoryMap[cat.category_id] = cat.category_name;
                    });
                    setCategories(categoryMap);
                } else {
                    setCategories({});
                    console.error("Unexpected response:", data);
                }
            })
            .catch((error) => {
                setCategories({});
                console.error("Error fetching category:", error);
            });

        fetch(`http://127.0.0.1:5000/usage_types`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const usageTypeMap: { [key: number]: string } = {};
                    data.forEach((ut: UsageType) => {
                        usageTypeMap[ut.usage_type_id] = ut.usage_type_name;
                    });
                    setUsageTypes(usageTypeMap);
                } else {
                    setUsageTypes({});
                    console.error("Unexpected response:", data);
                }
            })
            .catch((error) => {
                setUsageTypes({});
                console.error("Error fetching usage types:", error);
            });
    }, [propertyId]);

    return { items, categories, usageTypes };
}