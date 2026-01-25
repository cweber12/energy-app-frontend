// src/components/items/ItemInput.tsx
import React, { useState } from "react";
import { useElectricalItems } from "../../hooks/useItem";
import { addElectricalItem } from "../../services/itemService";
import { ItemInputForm } from "../../../types/itemTypes";
import HeaderDropdown from "../common/HeaderDropdown";
import "../Components.css";

// Type definitions for props
type ItemInputProps = {
    propertyId: string;
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
};

/*  Item Input Component
--------------------------------------------------------------------------------
Description: Form to add a new electrical item to a property.
Props:
    - propertyId: ID of the property to add the item to.
    - setShowItemInput: Function to hide the ItemInput component on cancel or 
      successful submission.
------------------------------------------------------------------------------*/
const ItemInput: React.FC<ItemInputProps> = ({ 
    propertyId, 
    setShowItemInput 
}) => {
    const [form, setForm] = useState<ItemInputForm>({
        category_id: "", 
        usage_type_id: "", 
        nickname: "", 
        rated_watts: "", 
    });
    const [message, setMessage] = useState("");
    const { categories , usageTypes } = useElectricalItems(propertyId);
    
    /* Handle form input changes
    ----------------------------------------------------------------------------
    - Updates form state on input change.
    - Converts numeric fields from string -> number.
    --------------------------------------------------------------------------*/
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        // Convert to number if the field should be a number
        if (name === "category_id" || name === "usage_type_id" || name === "rated_watts") {
            setForm({ ...form, [name]: value === "" ? "" : Number(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    /* Add new electrical item on form submission
    ----------------------------------------------------------------------------
    - addElectricalItem service sends POST request to backend.
    - On success, resets form and hides component
    - On failure, shows error message
    --------------------------------------------------------------------------*/
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await addElectricalItem(propertyId, {
                category_id: Number(form.category_id),
                usage_type_id: Number(form.usage_type_id),
                nickname: form.nickname,
                rated_watts: Number(form.rated_watts),
            });
            if (response.ok) {
                setMessage("Item added successfully!");
                setForm({
                    category_id: "",
                    usage_type_id: "",
                    nickname: "",
                    rated_watts: "",
                });
                setShowItemInput(false);
            } else {
                setMessage("Failed to add item.");
            }
        } catch (err) {
            setMessage("Error adding item: " + (err as Error).message);
        }
    };

    /* Render ItemInput component
    ----------------------------------------------------------------------------
    - Form fields: Category, Usage Type, Nickname, Rated Watts
    - Buttons: Add (submit), Cancel (hide component)
    - Displays success/error message
    --------------------------------------------------------------------------*/
    return (
        <HeaderDropdown>
            <form className="form" onSubmit={handleSubmit}>
             <label className="form-label">
                Category:
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    {Object.entries(categories).map(([category_id, category_name]) => (
                        <option key={category_id} value={category_id}>
                            {category_name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className="form-label">
                Usage Type:
                <select
                    name="usage_type_id"
                    value={form.usage_type_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a usage type</option>
                    {Object.entries(usageTypes).map(([usage_type_id, usage_type_name]) => (
                        <option key={usage_type_id} value={usage_type_id}>
                            {usage_type_name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label className="form-label">
                Nickname:
                <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                required
                />
            </label>
            <br />
            <label className="form-label">
                Rated Watts:
                <input
                name="rated_watts"
                value={form.rated_watts}
                onChange={handleChange}
                />
            </label>
            <br />
            <div className="button-group">
                <button type="submit" className="auth-button">Add</button>
                <button
                    type="button"
                    className="auth-button"
                    style={{ marginLeft: "10px" }}
                    onClick ={() => setShowItemInput(false)}
                >
                    Cancel
                </button>
            </div>
            {message && <div>{message}</div>}
            </form>
        </HeaderDropdown>
    );
};

export default ItemInput;