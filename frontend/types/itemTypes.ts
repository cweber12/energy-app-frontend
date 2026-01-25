// src/types/itemTypes.ts

// Type definition for category mapping (1 -> "HVAC", etc.)
export type Category = {
    category_id: number;
    category_name: string;
};

export type CategoryMap = {
    [key: number]: string;
};

// Type definition for usage type mapping (1 -> "Intermittent", etc.)
export type UsageType = {
    usage_type_id: number;
    usage_type_name: string;
};

export type UsageTypeMap = {
    [key: number]: string;
};

// Type definition for electrical item
export type Item = {
    item_id: number; 
    nickname: string; 
    category_id: number; 
    usage_type_id: number; 
    rated_watts: number; 
};

// Type definition for electrical item form submission
export type ElectricalItemForm = {
    category_id: number;
    usage_type_id: number;
    nickname: string;
    rated_watts: number;
};

// Type definition for form state
export type ItemInputForm = {
    category_id: number | ""; 
    usage_type_id: number | "";
    nickname: string;
    rated_watts: number | "";
};