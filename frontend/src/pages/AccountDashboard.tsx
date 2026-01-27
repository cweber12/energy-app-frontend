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
import EventReport from '../components/report/EventReport';
import { IntervalReading } from '../../types/reportTypes';
import { useLatestUsageReport } from "../hooks/useLatestUsageReport";
import { useUsageReportNavigator } from "../hooks/useUsageReportNavigator";



/*  Account Dashboard Page
--------------------------------------------------------------------------------
Description: Main dashboard page for user account management and data 
visualization.
------------------------------------------------------------------------------*/
const AccountDashboard = () => {
    const [showPropertyInput, setShowPropertyInput] = 
        React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const [propertyId, setPropertyId] = React.useState<string>("");
    const [itemId, setItemId] = React.useState<number>(0);
    const [showDailyEvents, setShowDailyEvents] = 
        React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    const [readings, setReadings] = useState<IntervalReading[]>([]);
    const [date, setDate] = useState<string>("");
    const [itemNickname, setItemNickname] = useState<string>("");
    const [refreshItems, setRefreshItems] = useState(0);
    const [refreshProperties, setRefreshProperties] = useState(0);

    const propertyIdNum = propertyId ? Number(propertyId) : 0;

    const {
        readings: savedReadings,
        date: savedDate,
        canPrev,
        canNext,
        goPrev,
        goNext,
        isLoading,
        error,
    } = useUsageReportNavigator(propertyIdNum, refreshProperties, { utility: "SDGE", meterName: null });

    // uploaded override (existing state)
    const displayReadings = readings.length > 0 ? readings : savedReadings;
    const displayDate = date || savedDate;

    /* Render Account Dashboard Page
    ----------------------------------------------------------------------------
    Contents: 
    - AccountDashboardHeader
    - PropertyInput: Form to add new property
    - ItemInput: Form to add new item
    - ItemMenu: Menu to select items and show item actions/reports
    - GetDailyEvents: Display daily events for selected item (start/end times)
    - UsageGraph: Graph of usage readings from energy provider (kWh per hour)
    - EventGraph: Graph on usage events corresponding to UsageGraph
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
                        setItemId={setItemId}
                        setItemNickname={setItemNickname}
                    />
                </div>
            )}
            {displayReadings.length > 0 && (
                <div className="column" style={{ gap: 0 }}>
                    <div className="row" style={{ gap: 12, alignItems: "center" }}>
                    <button
                        disabled={!canPrev}
                        onClick={async () => {
                        setReadings([]); // switch from uploaded override back to saved
                        setDate("");
                        await goPrev();
                        }}
                    >
                        Prev
                    </button>

                    <button
                        disabled={!canNext}
                        onClick={async () => {
                        setReadings([]);
                        setDate("");
                        await goNext();
                        }}
                    >
                        Next
                    </button>

                    {isLoading && <span>Loading…</span>}
                    {error && <span>{error}</span>}
                    </div>

                    <UsageGraph readings={displayReadings} date={displayDate} />
                    <EventGraph startDate={displayDate} />
                </div>
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;