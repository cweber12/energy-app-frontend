// src/components/properties/PropertyInput.tsx
import React, { useState } from "react";
import "../Components.css";
import HeaderDropdown from "../common/HeaderDropdown";
import { addProperty, PropertyForm } from "../../services/propertyService";


/*  Property Input Component
--------------------------------------------------------------------------------
Description: Form to add a new property for the user.
Props:
    - userId: ID of the user adding the property.
    - setShowPropertyInput: Show or hide the PropertyInput component.
------------------------------------------------------------------------------*/
const PropertyInput: React.FC<{ 
  userId: string,
  setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ userId, setShowPropertyInput }) => {
  const [form, setForm] = useState({
    street_address: "",
    city: "",
    state_abbreviation: "",
    zip: "",
  });
  const [message, setMessage] = useState("");

  /* Handle form input changes
  ----------------------------------------------------------------------------*/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Handle form submission to add new property
  ------------------------------------------------------------------------------
  - addProperty service sends POST request to backend API.
  - On success, resets form and shows success message.
  - On failure, shows error message.
  ----------------------------------------------------------------------------*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
        const response = await addProperty(userId, form as PropertyForm);
        if (response.ok) {
            setMessage("Property added successfully!");
            setForm({
                street_address: "",
                city: "",
                state_abbreviation: "",
                zip: "",
            });
        } else {
            setMessage("Failed to add property: " + response.statusText);
        }
    } catch (err) {
        setMessage("Error adding property: " + (err as Error).message);
    }
  };

  /* Render property input form
  ------------------------------------------------------------------------------
  Fields: Street, City, State, Zip
  Buttons: Add, Cancel
  Displays success/error message
  ----------------------------------------------------------------------------*/
  return (
    <HeaderDropdown>
      <form className="form" onSubmit={handleSubmit}>
        <br />
        <label className="form-label">
            Street:
            <input
            name="street_address"
            value={form.street_address}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label className="form-label">
            City:
            <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label className="form-label">
            State:
            <input
            name="state_abbreviation"
            value={form.state_abbreviation}
            onChange={handleChange}
            required
            />
        </label>
        <br />
        <label className="form-label">
            Zip:
            <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            />
        </label>
        <br />
        <div className="row">
        <button type="submit">Add</button>
          <button
            type="button"
            onClick={() => setShowPropertyInput(false)}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
        {message && <div>{message}</div>}
      </form>
    </HeaderDropdown>
  );
};

export default PropertyInput;