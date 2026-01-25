// src/pages/AccountDashboard.tsx
import React, { useState } from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/header/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/form/PropertyInput';
import ItemMenu from '../components/menu/ItemMenu';
import ItemInput from '../components/form/ItemInput';
import DailyEvents from '../components/action/DailyEvents';
import UsageGraph from '../components/graph/UsageGraph';
import EventGraph from '../components/graph/EventGraph';
import { IntervalReading } from '../../types/reportTypes';

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
    const [itemNickname, setItemNickname] = useState<string>("");
    
    
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
                <div className="row" style={{gap: 0, alignItems: "flex-start"}}>
                    <ItemMenu 
                        propertyId={propertyId}
                        setShowItemInput={setShowItemInput}
                        setShowDailyEvents={setShowDailyEvents}
                        showDailyEvents={showDailyEvents}
                        setItemId={setItemId}
                        setItemNickname={setItemNickname}
                    />
                    {showDailyEvents && itemId && (
                        <DailyEvents
                            itemId={parseInt(itemId)} 
                            itemNickname={itemNickname}
                            setShowDailyEvents={setShowDailyEvents}
                        />
                    )}
                </div>
            )}
            {readings.length > 0 && (
                <div className="column" style={{ gap: 0 }}>
                    <UsageGraph 
                        readings={readings}
                        date={date}
                        />
                    <EventGraph startDate={date} />
                </div>
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;