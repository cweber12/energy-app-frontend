import React, { useState } from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/headers/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/properties/PropertyInput';
import ItemMenu from '../components/items/ItemMenu';
import ItemInput from '../components/items/ItemInput';
import GetDailyEvents from '../components/items/GetDailyEvents';
import ViewUsageReport from '../components/report/ViewUsageReport';

const AccountDashboard = () => {
    const [showPropertyInput, setShowPropertyInput] = React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const [propertyId, setPropertyId] = React.useState<string>("");
    const [itemId, setItemId] = React.useState<string>("");
    const [showDailyEvents, setShowDailyEvents] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    const [xmlText, setXmlText] = useState<string>("");
    const [readings, setReadings] = useState<any[]>([]);
    
    
    
    return (
        <>
        <AccountDashboardHeader
            setShowPropertyInput={setShowPropertyInput}
            setShowItemInput={setShowItemInput}
            showPropertyInput={showPropertyInput}
            showItemInput={showItemInput}
            userId={userId}
            propertyId={propertyId}
            setPropertyId={setPropertyId}
            xmlText={xmlText}
            setXmlText={setXmlText}
            readings={readings}
            setReadings={setReadings}
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
            {showDailyEvents && itemId && (
                <GetDailyEvents itemId={parseInt(itemId)} />
            )}
            {readings.length > 0 && (

                <ViewUsageReport readings={readings} />
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;