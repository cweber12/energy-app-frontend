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
const AuthFormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="form-wrapper" 
        style={{ 
          color: colors.tertiaryText,
          padding: '1.5rem',
          backgroundColor: colors.secondaryBackground,
          border: `1px solid ${colors.border}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          width: '320px',
          maxWidth: '100%',
          boxSizing: 'border-box' as const,
        }}
        >
        {children}
    </div>
  );
}

export default AuthFormWrapper;