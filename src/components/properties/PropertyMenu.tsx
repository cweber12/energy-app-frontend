// src/components/menu/PropertyMenu.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import "../../App.css";
import "../Components.css";

/*  Property Menu Component
--------------------------------------------------------------------------------
    Description: A menu component for property-related actions.
    - Update properties
    - Select property to view
    - Sets selected property to session storage
------------------------------------------------------------------------------*/
type PropertyMenuProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    propertyId: string;
};

const PropertyMenu: React.FC<PropertyMenuProps> = ({ 
    setShowPropertyInput, 
    setPropertyId, 
    propertyId 
}) => {
    const userId = sessionStorage.getItem("user_id");
    
    const [options, setOptions] = useState([
        { value: 'add', label: 'Add Property' }
    ]);

    const customStyles = {
        option: (provided: any) => ({
            ...provided,
            color: 'black',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'black',
        }),
    };

    useEffect(() => {
        if (!userId) return;
        fetch(`http://127.0.0.1:5000/properties/${userId}`)
            .then(response => response.json())
            .then(data => {
                
                setOptions([
                    { value: 'add', label: 'Add Property' },
                    ...data.map((prop: any) => ({
                        value: prop.property_id,
                        label: prop.street_address
                    }))
                ]);
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
            });
    }, [userId]);

    const handleChange = (selected: any) => {
        if (!selected) return;
        if (selected.value === 'add') {
            setShowPropertyInput(true);
        } else {
            sessionStorage.setItem("currentProperty", selected.value);
            setPropertyId(selected.value);
        }
    };

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