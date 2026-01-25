// src/components/common/FormWrapper.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../../styles/Components.css";

/*  Form Wrapper Component
--------------------------------------------------------------------------------
Description: Reusable component that wraps forms with consistent styling.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="form-wrapper" 
        style={{ backgroundColor: colors.secondaryBackground }}
        >
        {children}
    </div>
  );
}

export default FormWrapper;