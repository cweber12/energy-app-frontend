// src/pages/AccountDashboard.tsx
import React, { useState } from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/header/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/form/PropertyInput';
import ItemMenu from '../components/menu/ItemMenu';
import ItemInput from '../components/form/ItemInput';
import GetDailyEvents from '../components/action/GetDailyEvents';
import UsageGraph from '../components/graph/UsageGraph';
import EventGraph from '../components/graph/EventGraph';

// Type for individual interval reading (from energy provider)
type IntervalReading = {
    hour: string; // e.g. "14:00"
    kWh: number; // e.g. 1.234
};

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
    const [itemId, setItemId] = React.useState<string>("");
    const [showDailyEvents, setShowDailyEvents] = 
        React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    const [readings, setReadings] = useState<IntervalReading[]>([]);
    const [date, setDate] = useState<string>("");
    
    
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
            setReadings={setReadings}
            setDate={setDate}
         />
        <PageWrapper>
            {showPropertyInput && (
                <PropertyInput 
                    userId={userId} 
                    setShowPropertyInput={setShowPropertyInput} 
                />
                
            )}
            {showItemInput && (
                <ItemInput 
                    propertyId={propertyId}
                    setShowItemInput={setShowItemInput}
                />
            )}
            {propertyId && (
                <ItemMenu 
                    propertyId={propertyId}
                    setShowItemInput={setShowItemInput}
                    setShowDailyEvents={setShowDailyEvents}
                    setItemId={setItemId}
                />
            )}
            <div className="column">
                {showDailyEvents && itemId && (
                    <GetDailyEvents itemId={parseInt(itemId)} />
                )}
                {readings.length > 0 && (
                    <>
                        <UsageGraph 
                            readings={readings}
                            date={date}
                         />
                        <EventGraph startDate={date} />
                    </>
                )}
            </div>
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;