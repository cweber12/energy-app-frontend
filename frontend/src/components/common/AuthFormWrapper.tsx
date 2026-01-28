// src/components/common/FormWrapper.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../../styles/Components.css";
import FormWrapper from './FormWrapper';

/*  Form Wrapper Component
--------------------------------------------------------------------------------
Description: Reusable component that wraps forms with consistent styling.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const AuthFormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="form-wrapper" 
        style={{ 
          backgroundColor: colors.tertiaryBackground, 
          color: colors.tertiaryText,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
        }}
        >
        {children}
    </div>
  );
}

export default AuthFormWrapper;