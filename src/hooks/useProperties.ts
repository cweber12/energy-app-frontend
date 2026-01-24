// src/hooks/useProperties.ts
import { useState, useEffect } from "react";
import { fetchPropertiesByUser } from "../services/propertyService";


// Type definition for property object
export type Property = {
    property_id: string;
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip: string;
};

// Type definition for property option in dropdown 
export type PropertyOption = {
    value: string; // property_id
    label: string; // street_address
};

/* Fetch Properties Hook
--------------------------------------------------------------------------------
Description: Fetches properties associated with a user ID with 
fetchPropertiesByUser and prepares options for a dropdown menu.
Params:
    - userId: ID of the user to fetch properties for.
Returns:
    - properties: Property[] array of property objects.
    - options: { value: property_id, label: street_address }[] for dropdown.
------------------------------------------------------------------------------*/
export function useProperties(userId: string) {
    const [options, setOptions] = useState<PropertyOption[]>([
        { value: 'add', label: 'Add Property' }
    ]);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (!userId) return;
        fetchPropertiesByUser(userId)
            .then(data => {
                setProperties(data);
                const opts = data.map((prop: Property) => ({
                    value: prop.property_id,
                    label: prop.street_address
                }));
                setOptions([{ value: 'add', label: 'Add Property' }, ...opts]);
            })
            .catch(error => {
                setProperties([]);
                setOptions([{ value: 'add', label: 'Add Property' }]);
                console.error("Error fetching properties:", error);
            });
    }, [userId]);

    return { properties, options };
}