// src/hooks/useProperties.ts
import { useState, useEffect } from "react";

// Type definition for property object
type Property = {
    property_id: string;
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip: string;
};

// Type definition for property option in dropdown 
type PropertyOption = {
    value: string; // property_id
    label: string; // street_address
};

/* Fetch Properties Hook
--------------------------------------------------------------------------------
Description: Fetches properties associated with a user ID and prepares options
for a dropdown menu.
Params:
    - userId: ID of the user to fetch properties for.
Returns:
    - properties: List of property objects (Property).
    - options: List of property options for dropdown (PropertyOption).
------------------------------------------------------------------------------*/
export function useProperties(userId: string) {
    const [options, setOptions] = useState<PropertyOption[]>([
        { value: 'add', label: 'Add Property' }
    ]);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
            if (!userId) return;
            fetch(`http://127.0.0.1:5000/properties/${userId}`)
                .then(response => response.json())
                .then(data => {
                    
                    setProperties(data);
                    const opts = data.map((prop: Property) => ({
                        value: prop.property_id,
                        label: prop.street_address
                    }));
                    setOptions([{ value: 'add', label: 'Add Property' }, ...opts]);
                })
        }, [userId]);

    return { properties, options };
}