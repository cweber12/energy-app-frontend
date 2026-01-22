import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import PropertyMenu from "../properties/PropertyMenu";
import ItemMenu from "../items/ItemMenu";
import UploadUsageReport from "../report/UploadUsageReport";


type AccountDashboardHeaderProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
    showPropertyInput: boolean;
    showItemInput: boolean;
    userId: string;
    propertyId: string;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    xmlText: string;
    setXmlText: React.Dispatch<React.SetStateAction<string>>;
    readings: any[];
    setReadings: React.Dispatch<React.SetStateAction<any[]>>;
};

const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
    setShowPropertyInput,
    setShowItemInput,
    showPropertyInput,
    showItemInput,
    userId, 
    propertyId, 
    setPropertyId,
    xmlText,
    setXmlText,
    readings,
    setReadings

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
                        xmlText={xmlText}
                        setXmlText={setXmlText}
                        readings={readings}
                        setReadings={setReadings}
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