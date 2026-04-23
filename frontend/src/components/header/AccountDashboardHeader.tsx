// src/components/headers/AccountDashboardHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import PropertyMenu from "../menu/PropertyMenu";
import UploadUsageReport from "../button/UploadUsageReport";
import { IntervalReading } from '../../../types/reportTypes';
import { UserIcon, LogOutIcon, ChevronDownIcon, ChevronUpIcon } from "../icons";

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
            style={{ backgroundColor: colors.secondaryBackground }}
            >
            <img
                src={`${process.env.PUBLIC_URL}/watt-watch-logo.png`}
                alt="WattWatch Logo"
                style={{ height: "44px", flexShrink: 0 }}
            />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: 0,
                    flexWrap: "wrap",
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
                
            <div 
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexShrink: 0,
                    color: colors.secondaryText,
                }}>
                <div className="user">
                    <UserIcon
                        size={22}
                        color={colors.iconSecondary}
                    />
                    <span style={{ fontSize: "var(--font-sm)", fontWeight: "var(--font-weight-medium)" }}>
                        {username ? username : "Guest"}
                    </span>
                    {showUserMenu ? (
                        <ChevronUpIcon
                            size={16}
                            color={colors.iconSecondary}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowUserMenu(false)}
                        />
                    ) : (
                        <ChevronDownIcon
                            size={16}
                            color={colors.iconSecondary}
                            style={{ cursor: "pointer" }}
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
                                        sessionStorage.clear();
                                        window.location.href = "/";
                                }}
                                >
                                Logout
                                <LogOutIcon
                                    size={18}
                                    color={colors.iconSecondary}
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