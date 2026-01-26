import { useState, useEffect } from "react";
import {
    fetchItemsByProperty,
    fetchItemCategories,
    fetchUsageTypes
} from "../supabase_services/itemsService";
import {
    CategoryMap,
    UsageTypeMap,
    Item
} from "../../types/itemTypes";

/* Fetch Electrical Items by Property
--------------------------------------------------------------------------------
Params:
    - propertyId: ID of the property to fetch items for.
Returns:
    - items: Item[]
    - categories: CategoryMap;
    - usageTypes: UsageTypeMap;
------------------------------------------------------------------------------*/
export function useElectricalItems(propertyId: string) {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<CategoryMap>({});
    const [usageTypes, setUsageTypes] = useState<UsageTypeMap>({});

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
