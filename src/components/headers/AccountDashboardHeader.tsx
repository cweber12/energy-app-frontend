import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import PropertyMenu from "../properties/PropertyMenu";
import UploadUsageReport from "../report/UploadUsageReport";

/* Account Dashboard Header Component
--------------------------------------------------------------------------------
Values passed between components and AccountDashboard: 
- setShowPropertyInput: 
------------------------------------------------------------------------------*/
type AccountDashboardHeaderProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    propertyId: string;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    setXmlText: React.Dispatch<React.SetStateAction<string>>;
    setReadings: React.Dispatch<React.SetStateAction<any[]>>;
    setDate: React.Dispatch<React.SetStateAction<string>>;
};

const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
    setShowPropertyInput, 
    propertyId, 
    setPropertyId,
    setXmlText,
    setReadings, 
    setDate

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
                        setPropertyId={setPropertyId}
                        propertyId={propertyId}
                    />
                    <UploadUsageReport
                        setXmlText={setXmlText}
                        setReadings={setReadings}
                        setDate={setDate}
                    />
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