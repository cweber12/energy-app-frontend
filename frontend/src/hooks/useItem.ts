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
Params  | propertyId: string ID of the property to fetch items for.
        | refreshItems?: number optional dependency to trigger refresh.
--------------------------------------------------------------------------------
Returns | items: Item[] array of electrical items.
        | categories: { [key: number]: string } mapping of category IDs to names.
        | usageTypes: { [key: number]: string } mapping of usage type IDs to names.
------------------------------------------------------------------------------*/
export function useAllItems(
    propertyId: string,
    refreshItems = 0,
) {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<CategoryMap>({});
    const [usageTypes, setUsageTypes] = useState<UsageTypeMap>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!propertyId) return;
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        Promise.all([
            fetchItemsByProperty(propertyId),
            fetchItemCategories(),
            fetchUsageTypes(),
        ])
            .then(([itemsData, categoriesData, usageTypesData]) => {
                if (cancelled) return;
                setItems(itemsData);
                setCategories(categoriesData);
                setUsageTypes(usageTypesData);
            })
            .catch((err) => {
                if (cancelled) return;
                setItems([]);
                setCategories({});
                setUsageTypes({});
                setError(err instanceof Error ? err.message : "Failed to fetch items");
                console.error("Error fetching items:", err);
            })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [propertyId, refreshItems]);

    return { items, categories, usageTypes, isLoading, error };
}
