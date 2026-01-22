import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import PropertyMenu from "../properties/PropertyMenu";
import ItemMenu from "../items/ItemMenu";


type AccountDashboardHeaderProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
    showPropertyInput: boolean;
    showItemInput: boolean;
  userId: string;
};

const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
    setShowPropertyInput,
    setShowItemInput,
    showPropertyInput,
    showItemInput,
    userId
}) => {
   
    const { colors } = useTheme();
    const username = sessionStorage.getItem("username") || "Guest";
    return (
        <header 
            className="header"
            style={{ backgroundColor: colors.navBackground }}
            >
            <div 
                style={{
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-start", 
                    gap: "10px"
                }}>
                <h2 style={{ color: colors.title}}>
                    Account Dashboard
                </h2>
                <div
                    style={{
                        display: "flex", 
                        flexDirection: "row", 
                        alignItems: "flex-start", 
                        gap: "10px"
                    }}>
                    <PropertyMenu 
                        setShowPropertyInput={setShowPropertyInput} 
                    />
                    {showPropertyInput && (
                    <button 
                        className="button"
                        style={{
                            backgroundColor: colors.button,
                            color: colors.buttonText
                        }}
                        onClick={() => setShowPropertyInput(false)}
                    >
                        Cancel
                    </button>
                    )}
                </div>
            </div>
                
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"}}>
                <h3 style={{ color: colors.title}}>
                    {username ? username : "Guest"} logged in
                </h3>
                <div className="button-group">
                    <button 
                        className="button"
                        style={{
                            backgroundColor: colors.button,
                            color: colors.buttonText
                        }}
                        onClick={() => {
                            // Clear session storage and redirect to home page
                            sessionStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                    
                </div>
            </div>
            
        </header>
    );
}
export default AccountDashboardHeader;