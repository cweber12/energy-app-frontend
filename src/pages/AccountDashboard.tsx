import React from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/headers/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import PropertyInput from '../components/properties/PropertyInput';
import ItemInput from '../components/items/ItemInput';

const AccountDashboard = () => {
    const [showPropertyInput, setShowPropertyInput] = React.useState<boolean>(false);
    const [showItemInput, setShowItemInput] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    return (
        <>
        <AccountDashboardHeader
            setShowPropertyInput={setShowPropertyInput}
            setShowItemInput={setShowItemInput}
            showPropertyInput={showPropertyInput}
            showItemInput={showItemInput}
            userId={userId}
         />
        <PageWrapper>
            {showPropertyInput && (
                <PropertyInput userId={userId} />
                
            )}
            {showItemInput && (
                <ItemInput propertyId={sessionStorage.getItem("currentProperty") || ""} />
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;