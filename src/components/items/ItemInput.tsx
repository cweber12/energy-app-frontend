import React, { useState, useEffect } from "react";
import HeaderDropdown from "../common/HeaderDropdown";
import "../Components.css";

const ItemInput: React.FC<{ propertyId: string }> = ({ propertyId }) => {
    const [form, setForm] = useState({
        category_id: "",
        usage_type_id: "",
        nickname: "",
        rated_watts: "",
});
    const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:5000/item_categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
        const response = await fetch("http://127.0.0.1:5000/electrical_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            property_id: propertyId,
            ...form,
            }),
        });
        if (response.ok) {
            setMessage("Item added successfully!");
            setForm({
            category_id: "",
            usage_type_id: "",
            nickname: "",
            rated_watts: "",
            });
        } else {
            setMessage("Failed to add item.");
        }
        } catch (err) {
        setMessage("Error adding item.");
        }
    };

    return (
        <HeaderDropdown>
            <form className="form" onSubmit={handleSubmit}>
             <label>
                Category:
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                    </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Usage Type ID:
                <input
                name="usage_type_id"
                value={form.usage_type_id}
                onChange={handleChange}
                required
                />
            </label>
            <br />
            <label>
                Nickname:
                <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                required
                />
            </label>
            <br />
            <label>
                Rated Watts:
                <input
                name="rated_watts"
                value={form.rated_watts}
                onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Add Item</button>
            {message && <div>{message}</div>}
            </form>
        </HeaderDropdown>
    );
};

export default ItemInput;