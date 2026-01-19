import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../Components.css";

/*  Form Wrapper Component
--------------------------------------------------------------------------------
    Description: Reusable component that wraps forms with consistent styling.
------------------------------------------------------------------------------*/

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="form-wrapper" 
        style={{ backgroundColor: colors.navBackground }}
        >
        {children}
    </div>
  );
}

export default FormWrapper;