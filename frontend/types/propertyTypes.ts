// types/propertyTypes.ts

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

// Type definition for property form submission
export type PropertyForm = {
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip: string;
};