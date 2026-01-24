// src/components/headers/AccountDashboardHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import PropertyMenu from "../menu/PropertyMenu";
import UploadUsageReport from "../action/UploadUsageReport";

// Type for individual interval reading (from energy provider)
type IntervalReading = {
    hour: string; // e.g. "14:00"
    kWh: number; // e.g. 1.234
};

type AccountDashboardHeaderProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    setReadings: React.Dispatch<React.SetStateAction<IntervalReading[]>>;
    setDate: React.Dispatch<React.SetStateAction<string>>;
};

/*  AccountDashboardHeader Component
--------------------------------------------------------------------------------
Description: Header component for the Account Dashboard page.   
Props: State setter functions for AccountDashboard states
    - setShowPropertyInput: Show/hide PropertyInput component
    - setPropertyId: Update current selected property ID
    - setReadings: Update parsed readings from usage report
    - setDate: Update current date from xml (for UsageGraph & EventGraph)
------------------------------------------------------------------------------*/
const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
    setShowPropertyInput, 
    setPropertyId,
    setReadings, 
    setDate

}) => {
   
    const { colors } = useTheme();
    const username = sessionStorage.getItem("username") || "Guest";

    /* Render Account Dashboard Header
    ----------------------------------------------------------------------------
    - Contains:  title, PropertyMenu, UploadUsageReport, username display, and 
      Logout button
    - Uses props to pass state setters to PropertyMenu and UploadUsageReport 
    --------------------------------------------------------------------------*/
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
                    />
                    <UploadUsageReport
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