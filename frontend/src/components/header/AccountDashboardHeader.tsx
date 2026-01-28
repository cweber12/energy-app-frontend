// src/components/headers/AccountDashboardHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import PropertyMenu from "../menu/PropertyMenu";
import UploadUsageReport from "../button/UploadUsageReport";
import { IntervalReading } from '../../../types/reportTypes';
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

type AccountDashboardHeaderProps = {
    setShowPropertyInput: React.Dispatch<React.SetStateAction<boolean>>;
    setPropertyId: React.Dispatch<React.SetStateAction<string>>;
    propertyId: string;
    setReadings: React.Dispatch<React.SetStateAction<IntervalReading[]>>;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    refreshProperties: number;
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
    propertyId,
    setReadings, 
    setDate, 
    refreshProperties,
}) => {
   
    const { colors } = useTheme();
    const username = sessionStorage.getItem("username") || "Guest";
    const [showUserMenu, setShowUserMenu] = React.useState<boolean>(false);

    /* Render Account Dashboard Header
    ----------------------------------------------------------------------------
    - Contains:  title, PropertyMenu, UploadUsageReport, username display, and 
      Logout button
    - Uses props to pass state setters to PropertyMenu and UploadUsageReport 
    --------------------------------------------------------------------------*/
    return (
        <header 
            className="header"
            style={{ 
                backgroundColor: colors.secondaryBackground }}
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
                        refreshProperties={refreshProperties}
                    />
                    <UploadUsageReport
                        propertyId={propertyId}
                        setReadings={setReadings}
                        setDate={setDate}
                    />
                </div>
            </div>
                
            <div 
                style={{
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-end", 
                    gap: "10px",
                    color: colors.secondaryText
                }}>
                <div className="user">
                    <FaRegCircleUser
                        style={{ 
                            color: colors.iconSecondary,
                            width: "32px", 
                            height: "32px" 
                        }}
                    /> 
                    <h3>{username ? username : "Guest"}</h3>
                    {showUserMenu ? (
                        <FaAngleUp
                            style={{ width: "32px", height: "32px", cursor: "pointer", color: colors.iconSecondary }}
                            onClick={() => setShowUserMenu(false)}
                        />
                    ) : (
                        <FaAngleDown
                            style={{ width: "32px", height: "32px", cursor: "pointer", color: colors.iconSecondary }}
                            onClick={() => setShowUserMenu(true)}
                        />
                    )}
                    {showUserMenu && (
                        <div 
                            className="user-menu-dropdown"
                            style={{ backgroundColor: colors.secondaryBackground, color: colors.secondaryText }}
                            >
                            <div 
                                className="dropdown-item"
                                onClick={() => {
                                        // Clear session storage and redirect to home page
                                        sessionStorage.clear();
                                        window.location.href = "/";
                                }}
                                >
                                Logout 
                                <IoLogOutOutline
                                    style={{ 
                                        cursor: "pointer", 
                                        color: colors.iconSecondary,
                                        width: "32px",
                                        height: "32px",
                                    }}
                                />
                            </div>    
                        </div>
                    )}
                </div>
                
            </div>
            
        </header>
    );
}
export default AccountDashboardHeader;