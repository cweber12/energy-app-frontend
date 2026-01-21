import React, { useState } from "react";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";
import HeaderDropdownLeft from "../common/HeaderDropdownLeft";

const PropertyInput: React.FC<{ userId: string }> = ({ userId }) => {
  const [form, setForm] = useState({
    street_address: "",
    city: "",
    state_abbreviation: "",
    zip: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://127.0.0.1:5000/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            ...form,
          
        }),
      });
      if (response.ok) {
        setMessage("Property added successfully!");
        setForm({
          street_address: "",
          city: "",
          state_abbreviation: "",
          zip: "",
        });
      } else {
        setMessage("Failed to add property.");
      }
    } catch (err) {
      setMessage("Error adding property.");
    }
  };

  return (
    <HeaderDropdownLeft>
      <form className="form" onSubmit={handleSubmit}>
        <br />
        <label>
            Street:
            <input
            name="street_address"
            value={form.street_address}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label>
            City:
            <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label>
            State:
            <input
            name="state_abbreviation"
            value={form.state_abbreviation}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label>
            Zip:
            <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            />
        </label>
        <br />
        <button type="submit">Add</button>
        {message && <div>{message}</div>}
      </form>
    </HeaderDropdownLeft>
  );
};

export default PropertyInput;