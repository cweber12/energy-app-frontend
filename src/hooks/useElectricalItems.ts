// src/hooks/useElectricalItems.ts
import { useState, useEffect } from "react";
import { 
    fetchItemsByProperty, 
    fetchItemCategories, 
    fetchUsageTypes 
} from "../services/itemService";

// Type definition for category mapping (1 -> "HVAC", etc.)
export type CategoryType = {
    category_id: number;
    category_name: string;
};

// Type definition for usage type mapping (1 -> "Intermittent", etc.)
export type UsageType = {
    usage_type_id: number;
    usage_type_name: string;
};

// Type definition for electrical item
export type ItemType = {
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

        fetchItemsByProperty(propertyId)
            .then(setItems)
            .catch((error) => {
                setItems([]);
                console.error("Error fetching items:", error);
            });

        fetchItemCategories()
            .then(setCategories)
            .catch((error) => {
                setCategories({});
                console.error("Error fetching category:", error);
            });

        fetchUsageTypes()
            .then(setUsageTypes)
            .catch((error) => {
                setUsageTypes({});
                console.error("Error fetching usage types:", error);
            });
    }, [propertyId]);

    return { items, categories, usageTypes };
}

export type UseElectricalItemsReturn = {
    items: ItemType[];
    categories: CategoryType[];
    usageTypes: UsageType[];
};