// src/components/menu/PropertyMenu.tsx
import React, { useState, useEffect } from 'react';
import { useProperties } from "../../hooks/useProperty";
import { Property, PropertyOption } from '../../../types/propertyTypes';
import { fetchMyProperties } from "../../supabase_services/propertiesService";
import Select from 'react-select';
import type { CSSObjectWithLabel } from "react-select";
import "../../App.css";
import "../../styles/Components.css";

type PropertyMenuProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
};

/*  Property Menu Component
--------------------------------------------------------------------------------
Description: A menu component to select existing properties or add a new one.
Props:
    - setShowPropertyInput: Function to show the PropertyInput component.
    - setPropertyId: Function to set the selected property ID.
    - propertyId: Currently selected property ID.
------------------------------------------------------------------------------*/
const PropertyMenu: React.FC<PropertyMenuProps> = ({ 
    setShowPropertyInput, 
    setPropertyId, 
}) => {

    // Fetch properties and options using custom hook
    const { options } = useProperties(sessionStorage.getItem("user_id") ?? "");

    // Custom styles for react-select
    const customStyles = {
        option: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'black',
        }),
        singleValue: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'black',
        }),
    };

    /* Handle property selection changes
    --------------------------------------------------------------------------*/
    const handleChange = (selected: PropertyOption | null) => {
        if (!selected) return;
        if (selected.value === 'add') {
            setShowPropertyInput(true);
        } else {
            sessionStorage.setItem("currentProperty", selected.value);
            setPropertyId(selected.value);
        }
    };

    /* Render property selection menu
    ----------------------------------------------------------------------------
    - Dropdown menu to select existing properties or add a new one
    --------------------------------------------------------------------------*/
    return (
        <Select
            options={options}
            onChange={handleChange}
            placeholder="Select or add property..."
            styles={customStyles}
        />
    );
}

export default PropertyMenu;