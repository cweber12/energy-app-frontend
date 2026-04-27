// src/components/properties/PropertyInput.tsx
import React, { useState } from "react";
import "../../styles/Components.css";
import HeaderDropdown from "../common/HeaderDropdown";
import { addProperty } from "../../supabase_services/propertiesService";
import { PropertyForm } from "../../../types/propertyTypes";
import CustomButton from "../button/CustomButton";

/*  Property Input Component
--------------------------------------------------------------------------------
Description: Form to add a new property for the user.
Props:
    - userId: ID of the user adding the property.
    - setShowPropertyInput: Show or hide the PropertyInput component.
------------------------------------------------------------------------------*/
const PropertyInput: React.FC<{ 
  userId: string,
  setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>, 
  setRefreshProperties: React.Dispatch<React.SetStateAction<number>>,
}> = ({ 
  userId, 
  setShowPropertyInput, 
  setRefreshProperties 
}) => {
  const [form, setForm] = useState({
    street_address: "",
    city: "",
    state_abbreviation: "",
    zip: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await addProperty(form as PropertyForm);
      setSuccessMessage("Property added.");
      setForm({
          street_address: "",
          city: "",
          state_abbreviation: "",
          zip: "",
      });
      setRefreshProperties(prev => prev + 1);
      setShowPropertyInput(false);   
    } catch (err) {
        setErrorMessage("Error adding property: " + (err as Error).message);
    }
  };

  /* Render property input form
  ------------------------------------------------------------------------------
  Fields: Street, City, State, Zip
  Buttons: Add, Cancel
  Displays success/error message
  ----------------------------------------------------------------------------*/
  return (
    <HeaderDropdown onClose={() => setShowPropertyInput(false)} id="property-input">
      <h2 id="property-input-title" className="dropdown-heading">Add Property</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
            Street:
            <input
            name="street_address"
            value={form.street_address}
            onChange={handleChange}
            required
            />
        </label>
        <label className="form-label">
            City:
            <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            />
        </label>
        <label className="form-label">
            State:
            <input
            name="state_abbreviation"
            value={form.state_abbreviation}
            onChange={handleChange}
            required
            />
        </label>
        <label className="form-label">
            Zip:
            <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            />
        </label>
        <div className="row">
        <CustomButton type="submit">Add</CustomButton>
        </div>
        {successMessage && <div style={{ fontSize: "var(--font-sm)", color: "var(--color-btn-start)" }}>{successMessage}</div>}
        {errorMessage && <div style={{ fontSize: "var(--font-sm)", color: "var(--color-text-warning)" }}>{errorMessage}</div>}
      </form>
    </HeaderDropdown>
  );
};

export default PropertyInput;