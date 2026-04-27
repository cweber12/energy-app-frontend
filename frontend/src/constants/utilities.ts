// Default utility provider for meter lookups. Centralised here so that
// "SDGE" never appears as a bare string literal across multiple files.
export const DEFAULT_UTILITY = "SDGE";

// Usage type ID for items that can be manually toggled on/off.
// Matches the usage_type.usage_type_id value in the database.
export const INTERMITTENT_USAGE_TYPE_ID = 2;
