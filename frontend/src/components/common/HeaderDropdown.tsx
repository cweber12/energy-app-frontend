// src/components/common/HeaderDropdown.tsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../../styles/Components.css";
import { CloseIcon } from "../icons";

interface HeaderDropdownProps {
  children: React.ReactNode;
  onClose: () => void;
  id: string;
}

/*  HeaderDropdown Component
--------------------------------------------------------------------------------
Description: Viewport-centered fixed panel that drops below the navigation bar.
Includes a semi-transparent backdrop for click-away dismissal and a close button.
Props:
    - children: Form content to display inside the dropdown.
    - onClose:  Callback to invoke when the panel is dismissed.
    - id:       Unique identifier used for aria-labelledby.
------------------------------------------------------------------------------*/
const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ children, onClose, id }) => {
  const { colors } = useTheme();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      (previousFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  return (
    <>
      {/* Click-away backdrop */}
      <div
        className="header-dropdown-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating panel */}
      <div
        className="header-dropdown-panel"
        style={{
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
          color: colors.primaryText,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="header-dropdown-close"
          onClick={onClose}
          aria-label="Close"
          style={{ color: colors.primaryText }}
        >
          <CloseIcon size={16} />
        </button>

        {children}
      </div>
    </>
  );
};

export default HeaderDropdown;
