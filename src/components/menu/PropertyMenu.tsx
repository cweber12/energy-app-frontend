// src/components/menu/PropertyMenu.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import type { CSSObjectWithLabel } from "react-select";
import "../../App.css";
import "../Components.css";

type Property = {
    property_id: string;
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip: string;
};

type PropertyOption = {
    value: string;
    label: string;
};

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
    const userId = sessionStorage.getItem("user_id");
    
    // State to hold property options for the dropdown and Add Property option
    const [options, setOptions] = useState([
        { value: 'add', label: 'Add Property' }
    ]);

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

    /* Fetch properties for the user on component mount
    --------------------------------------------------------------------------*/
    useEffect(() => {
        if (!userId) return;
        fetch(`http://127.0.0.1:5000/properties/${userId}`)
            .then(response => response.json())
            .then(data => {
                
                setOptions([
                    { value: 'add', label: 'Add Property' },
                    ...data.map((prop: Property) => ({
                        value: prop.property_id,
                        label: prop.street_address
                    }))
                ]);
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
            });
    }, [userId]);

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