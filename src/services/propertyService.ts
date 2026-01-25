// src/services/propertyService.ts
import { Property, PropertyForm } from "../../types/propertyTypes";

/* Add Property
--------------------------------------------------------------------------------
Params   | userId: ID of the user adding the property.
         | form: PropertyForm object with property details.
--------------------------------------------------------------------------------
Returns  | Response object from the fetch call.
------------------------------------------------------------------------------*/
export async function addProperty(userId: string, form: PropertyForm) {
    const response = await fetch("http://127.0.0.1:5000/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            ...form,
        }),
    });
    return response;
}

/* Fetch Properties by User
--------------------------------------------------------------------------------
Params   | userId: ID of the user to fetch properties for.
--------------------------------------------------------------------------------
Returns  | Property[] array of property objects.
------------------------------------------------------------------------------*/
export async function fetchPropertiesByUser(userId: string): Promise<Property[]> {
    const response = await fetch(`http://127.0.0.1:5000/properties/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return response.json();
}