// src/pages/AccountDashboard.tsx
import React, { useState } from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/header/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/form/PropertyInput';
import ItemMenu from '../components/menu/ItemMenu';
import ItemInput from '../components/form/ItemInput';
import UsageGraph from '../components/graph/UsageGraph';
import EventGraph from '../components/graph/EventGraph';
import { IntervalReading } from '../../types/reportTypes';
import { useUsageReportNavigator } from "../hooks/useUsageReportNavigator";
import Card from '../components/common/Card';
import { useTheme } from '../context/ThemeContext';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import CardHeader from '../components/common/CardHeader';
import { LuInfo } from "react-icons/lu";

/*  Account Dashboard Page
--------------------------------------------------------------------------------
Description: Main dashboard page for user account management and data 
visualization.
------------------------------------------------------------------------------*/
const AccountDashboard = () => {
    const userId = sessionStorage.getItem("user_id") || "";
    
    const [showPropertyInput, setShowPropertyInput] = 
        React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const [propertyId, setPropertyId] = React.useState<string>("");
    const [showDailyEvents, setShowDailyEvents] = 
        React.useState<boolean>(false);
    const [readings, setReadings] = useState<IntervalReading[]>([]);
    const [date, setDate] = useState<string>("");
    const [refreshItems, setRefreshItems] = useState(0);
    const [refreshProperties, setRefreshProperties] = useState(0);
    const { colors } = useTheme();
    const propertyIdNum = propertyId ? Number(propertyId) : 0;
    const [showReportInfo, setShowReportInfo] = useState<boolean>(false);

    /* Use custom hook to navigate usage reports
    --------------------------------------------------------------------------*/
    const {
        readings: savedReadings,
        date: savedDate,
        canPrev,
        canNext,
        goPrev,
        goNext,
        isLoading,
        error,
    } = useUsageReportNavigator(
        propertyIdNum, 
        refreshProperties, 
        { utility: "SDGE", meterName: null }
    );

    // uploaded override (existing state)
    const displayReadings = readings.length > 0 ? readings : savedReadings;
    const displayDate = date || savedDate;

    /* Render Account Dashboard Page
    --------------------------------------------------------------------------*/
    return (
        <>
        <AccountDashboardHeader
            setShowPropertyInput={setShowPropertyInput}
            setPropertyId={setPropertyId}
            propertyId={propertyId}
            setReadings={setReadings}
            setDate={setDate}
            refreshProperties={refreshProperties}
         />
        <PageWrapper>
            {showPropertyInput && (
                <PropertyInput 
                    userId={userId} 
                    setShowPropertyInput={setShowPropertyInput} 
                    setRefreshProperties={setRefreshProperties}
                />
                
            )}
            {showItemInput && (
                <ItemInput 
                    propertyId={propertyId}
                    setShowItemInput={setShowItemInput}
                    onItemAdded={() => setRefreshItems(x => x + 1)}
                />
            )}
            {propertyId && (
                <div className="column" style={{gap: 0, alignItems: "flex-start"}}>
                    <ItemMenu 
                        propertyId={propertyId}
                        refreshItems={refreshItems}
                        setShowItemInput={setShowItemInput}
                        showItemInput={showItemInput}
                        setShowDailyEvents={setShowDailyEvents}
                        showDailyEvents={showDailyEvents}
                    />
                </div>
            )}
            {displayReadings.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="row">
                            {!isLoading && !error && (
                            <h3 style={{ color: colors.primaryText }}>REPORT FOR {displayDate}</h3>)}
                            {isLoading && <span>Loading…</span>}
                            {error && <span>{error}</span>}
                            <LuInfo
                                size={24}
                                style={{
                                    marginLeft: "0.5rem",
                                    cursor: "pointer",
                                    color: colors.primaryText,
                                }}
                                onClick={() => setShowReportInfo(!showReportInfo)}
                            />
                        </div>

                        <div className="button-group">
                            <button
                                style={{
                                    backgroundColor: !canPrev ? colors.buttonDisabled : colors.button, 
                                    color: colors.buttonText
                                }}
                                disabled={!canPrev}
                                onClick={async () => {
                                setReadings([]);
                                setDate("");
                                await goPrev();
                                }}
                            >
                                <FiChevronLeft 
                                    size={32} 
                                    color={colors.buttonText} 
                                    style={{ marginRight: "0.5rem" }} 
                                />
                                Prev
                            </button>

                            <button
                                style={{
                                    backgroundColor: !canNext ? colors.buttonDisabled : colors.button, 
                                    color: colors.buttonText
                                }}
                                disabled={!canNext}
                                onClick={async () => {
                                setReadings([]);
                                setDate("");
                                await goNext();
                                }}
                            >

                                Next
                                <FiChevronRight 
                                    size={32} 
                                    color={colors.buttonText}
                                    style={{ marginLeft: "0.5rem" }} 
                                />
                            </button>
                        </div>
                    </CardHeader>
                    {showReportInfo && (
                        <div 
                            className="info-popup"
                            style={{
                                background: colors.secondaryBackground,
                                color: colors.secondaryText,
                                maxWidth: "30vw",
                                padding: "1rem",
                                fontSize: "1.1rem",
                            }}
                        >
                            <p>
                                This report visualizes the energy usage data for the selected property on the specified date.
                                Compare the hourly meter load with your recorded usage events to gain insights into your energy 
                                consumption patterns.
                            </p>
                            <ul>
                                <li>The hourly meter load graph shows kWh per hour readings from the electricity meter.</li>
                                <li>The event graph below displays your energy usage events for the selected date.</li>
                                <li>Use the navigation buttons to view reports for different dates.</li>
                                <li>Upload readings (.xml format) from your SDGE portal using the upload button above.</li>
                            </ul>
                        </div>
                    )}
                    <UsageGraph readings={displayReadings} date={displayDate} />
                    <EventGraph startDate={displayDate} />
                </Card>
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;