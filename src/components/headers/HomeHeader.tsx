import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "./Headers.css";

const HomeHeader: React.FC<{
    showLogin: boolean,
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>,
    showRegister: boolean,
    setShowRegister: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister
}) => {
  const { colors, scheme } = useTheme();
    return (
        <header 
            className="header" 
            style={{ backgroundColor: colors.navBackground }}
            >
            <h1 style={{ color: colors.title, margin: 0 }}>
                Home Energy Audit
            </h1>
            <div className="button-group">
                <button 
                    className="button"
                    onClick={() => {
                        setShowLogin(true);
                        setShowRegister(false);
                    }}
                    style={{ 
                        backgroundColor: showLogin ? colors.buttonHover : colors.button, 
                        color: colors.buttonText 
                    }}
                >
                    Login
                </button>
                <button 
                    className="button"
                    onClick={() => {
                        setShowRegister(true);
                        setShowLogin(false);
                    }}
                    style={{ 
                        backgroundColor: showRegister ? colors.buttonHover : colors.button, 
                        color: colors.buttonText 
                    }}
                >
                    Register
                </button>
            </div>
        </header>
    );
}

export default HomeHeader;