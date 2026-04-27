// src/components/menu/PropertyMenu.tsx
import React from 'react';
import { useProperties } from "../../hooks/useProperty";
import { PropertyOption } from '../../../types/propertyTypes';
import Select from 'react-select';
import type { CSSObjectWithLabel } from "react-select";
import "../../App.css";
import "../../styles/Components.css";

type PropertyMenuProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    refreshProperties: number;
};

/*  Property Menu Component
--------------------------------------------------------------------------------
Select existing properties or add a new one.
Props | setShowPropertyInput: Show/hide PropertyInput component
      | setPropertyId: Update current selected property ID
      | refreshProperties: Dependency to trigger properties refresh
------------------------------------------------------------------------------*/
const PropertyMenu: React.FC<PropertyMenuProps> = ({ 
    setShowPropertyInput, 
    setPropertyId,
    refreshProperties, 
}) => {

    // Fetch properties and options with custom hook
    const { options, firstPropertyId } = 
        useProperties(sessionStorage.getItem("user_id") ?? "", refreshProperties, setPropertyId);

    // Derive controlled value from sessionStorage or firstPropertyId
    const currentPropertyId = sessionStorage.getItem("currentProperty") || firstPropertyId;
    const selectedValue = options.find(o => o.value === currentPropertyId) ?? null;

    // Custom styles for react-select — integrate with CSS theme variables
    const customStyles = {
        control: (provided: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
            ...provided,
            minWidth: 200,
            maxWidth: 280,
            height: 36,
            minHeight: 36,
            fontSize: 'var(--font-sm)',
            borderColor: state.isFocused ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: 'var(--color-surface-secondary)',
            color: 'var(--color-text-primary)',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(20,86,184,0.2)' : 'none',
            cursor: 'pointer',
            '&:hover': {
                borderColor: 'var(--color-accent)',
            },
        }),
        menu: (provided: CSSObjectWithLabel) => ({
            ...provided,
            backgroundColor: 'var(--color-surface-secondary)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 300,
        }),
        option: (provided: CSSObjectWithLabel, state: { isFocused: boolean; isSelected: boolean }) => ({
            ...provided,
            fontSize: 'var(--font-sm)',
            color: state.isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
            backgroundColor: state.isSelected
                ? 'var(--color-accent)'
                : state.isFocused
                ? 'var(--color-surface-tertiary)'
                : 'var(--color-surface-secondary)',
            cursor: 'pointer',
        }),
        singleValue: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-sm)',
        }),
        placeholder: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-sm)',
        }),
        input: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-text-primary)',
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-icon-secondary)',
            padding: '0 6px',
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
    --------------------------------------------------------------------------*/
    return (
        <Select
            options={options}
            onChange={handleChange}
            value={selectedValue ?? null}
            placeholder="Select or add property..."
            styles={customStyles}
        />
    );
}

export default PropertyMenu;