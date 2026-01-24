import { Property } from "../hooks/useProperties";

export type PropertyForm = {
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip: string;
};

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

export async function fetchPropertiesByUser(userId: string): Promise<Property[]> {
    const response = await fetch(`http://127.0.0.1:5000/properties/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return response.json();
}