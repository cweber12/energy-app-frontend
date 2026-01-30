import React, { useState } from 'react';
import { useTheme } from "../../context/ThemeContext";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  style,
  disabled,
  type = "button"
}) => {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type={type}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      onClick={disabled ? undefined : onClick}
      style={{
        backgroundColor: disabled
          ? colors.buttonDisabled
          : hovered
          ? colors.buttonHover
          : colors.button,
        color: hovered ? colors.title : colors.buttonText,
        boxShadow: hovered ? `0 0px 4px ${colors.primaryText}` :  `0 0px 2px ${colors.primaryText}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 0.2s",
        fontWeight: 500,
        gap: "1rem",
        padding: "0 1.5rem",
        ...style,
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;