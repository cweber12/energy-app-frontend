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
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_UTILITY } from '../constants/utilities';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from '../components/icons';
import CardHeader from '../components/common/CardHeader';
import CustomButton from '../components/button/CustomButton';

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
        { utility: DEFAULT_UTILITY, meterName: null }
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
        <ErrorBoundary>
            {!propertyId && (
                <p style={{
                    width: "100%",
                    textAlign: "center",
                    color: colors.mutedText,
                    fontSize: "var(--font-base)",
                    margin: "var(--space-8) 0",
                }}>
                    Select a property to get started, or add one using the dropdown above.
                </p>
            )}
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
                    <ItemMenu
                        propertyId={propertyId}
                        refreshItems={refreshItems}
                        setShowItemInput={setShowItemInput}
                        showItemInput={showItemInput}
                        setShowDailyEvents={setShowDailyEvents}
                        showDailyEvents={showDailyEvents}
                    />
            )}
            {displayReadings.length > 0 && (
                <div 
                    className="column"
                    style={{ 
                        flex: 1,
                        gap: "0", 
                        alignItems: "stretch", 
                        border: `1px solid ${colors.border}`,
                        boxShadow: "var(--shadow-card)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    <CardHeader>
                        <div className="row" style={{ gap: "var(--space-2)", alignItems: "center" }}>
                            {!isLoading && !error && (
                                <h3 style={{ color: colors.primaryText, fontSize: "var(--font-base)", fontWeight: 600 }}>
                                    {displayDate}
                                </h3>
                            )}
                            {isLoading && <span style={{ fontSize: "var(--font-sm)", color: colors.mutedText }}>Loading…</span>}
                            {error && <span style={{ fontSize: "var(--font-sm)", color: colors.warning }}>{error}</span>}
                            <InfoIcon
                                size={16}
                                color={colors.mutedText}
                                style={{ cursor: "pointer", flexShrink: 0 }}
                                onClick={() => setShowReportInfo(!showReportInfo)}
                                title="About this report"
                            />
                        </div>

                        <div className="button-group">
                            <CustomButton
                                disabled={!canPrev}
                                onClick={async () => {
                                    setReadings([]);
                                    setDate("");
                                    await goPrev();
                                }}
                                style={{ padding: "0 var(--space-3)" }}
                            >
                                <ChevronLeftIcon size={16} />
                                Prev
                            </CustomButton>

                            <CustomButton
                                disabled={!canNext}
                                onClick={async () => {
                                    setReadings([]);
                                    setDate("");
                                    await goNext();
                                }}
                                style={{ padding: "0 var(--space-3)" }}
                            >
                                Next
                                <ChevronRightIcon size={16} />
                            </CustomButton>
                        </div>
                    </CardHeader>
                    {showReportInfo && (
                        <div 
                            className="info-popup"
                            style={{
                                background: colors.secondaryBackground,
                                color: colors.secondaryText,
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
                </div>
            )}
        </ErrorBoundary>
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;