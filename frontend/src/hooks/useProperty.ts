// src/hooks/useProperties.ts
import { useState, useEffect } from "react";
import { fetchMyProperties } from "../supabase_services/propertiesService";
import { Property, PropertyOption } from "../../types/propertyTypes";

/* Fetch Properties by User
--------------------------------------------------------------------------------
Params  | userId: string ID of the user to fetch properties for.
        | refreshProperties?: number optional dependency to trigger refresh.
--------------------------------------------------------------------------------
Returns | properties: Property[] array of user properties.
        | options: PropertyOption[] array for dropdown selection.
------------------------------------------------------------------------------*/
export function useProperties(
    userId: string, refreshProperties?: number) {
    const [options, setOptions] = useState<PropertyOption[]>([
        { value: 'add', label: 'Add Property' }
    ]);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (!userId) return;
        fetchMyProperties()
            .then(data => {
                setProperties(data);
                const opts = data.map((prop: Property) => ({
                    value: prop.property_id.toString(),
                    label: `${prop.street_address}, ${prop.city}, ${prop.state_abbreviation} ${prop.zip}`
                }));
                setOptions([{ value: 'add', label: 'Add Property' }, ...opts]);
            })
            .catch(error => {
                setProperties([]);
                setOptions([{ value: 'add', label: 'Add Property' }]);
                console.error("Error fetching properties:", error);
            });
    }, [userId, refreshProperties]);

    return { properties, options };
}