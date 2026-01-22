import React from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/headers/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/properties/PropertyInput';
import ItemMenu from '../components/items/ItemMenu';
import ItemInput from '../components/items/ItemInput';

const AccountDashboard = () => {
    const [showPropertyInput, setShowPropertyInput] = React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const [propertyId, setPropertyId] = React.useState<string>("");
    const userId = sessionStorage.getItem("user_id") || "";
    
    
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
            <ItemMenu 
                propertyId={propertyId}
                setShowItemInput={setShowItemInput}
            />
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;