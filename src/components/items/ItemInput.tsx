import React, { useState } from "react";
import "../Components.css";

const ItemInput: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [form, setForm] = useState({
    category_id: "",
    usage_type_id: "",
    nickname: "",
    rated_watts: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Category ID:
        <input
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        />
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
  );
};

export default ItemInput;