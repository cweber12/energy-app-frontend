import React, { useState } from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/headers/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/properties/PropertyInput';
import ItemMenu from '../components/items/ItemMenu';
import ItemInput from '../components/items/ItemInput';
import GetDailyEvents from '../components/items/GetDailyEvents';
import UsageGraph from '../components/report/UsageGraph';
//import EventGraph from '../components/report/EventGraph';
import EventGraph from '../components/report/EventGraph';

const AccountDashboard = () => {
    const [showPropertyInput, setShowPropertyInput] = React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const [propertyId, setPropertyId] = React.useState<string>("");
    const [itemId, setItemId] = React.useState<string>("");
    const [showDailyEvents, setShowDailyEvents] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    const [xmlText, setXmlText] = useState<string>("");
    const [readings, setReadings] = useState<any[]>([]);
    const [date, setDate] = useState<string>("");
    
    
    
    return (
        <>
        <AccountDashboardHeader
            setShowPropertyInput={setShowPropertyInput}
            propertyId={propertyId}
            setPropertyId={setPropertyId}
            setXmlText={setXmlText}
            setReadings={setReadings}
            setDate={setDate}
         />
        <PageWrapper>
            {showPropertyInput && (
                <PropertyInput userId={userId} />
                
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