import React, { useState } from 'react';
import { useTheme } from "../../context/ThemeContext";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string | undefined;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  style,
  disabled,
  type = "button",
  title
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
        color: colors.buttonText,
        boxShadow: hovered ? `var(--shadow-md)` : `var(--shadow-sm)`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "background-color var(--transition-base), box-shadow var(--transition-base)",
        fontWeight: 500,
        fontSize: "var(--font-sm)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "0 var(--space-4)",
        height: "36px",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default CustomButton;