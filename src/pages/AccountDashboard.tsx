import React from 'react';
import "../App.css";
import AccountDashboardHeader from '../components/headers/AccountDashboardHeader';
import PageWrapper from '../components/common/PageWrapper';
import AddProperty from '../components/properties/PropertyInput';

const AccountDashboard = () => {
    const [showAddProperty, setShowAddProperty] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id") || "";
    return (
        <>
        <AccountDashboardHeader
            setShowAddProperty={setShowAddProperty}
            showAddProperty={showAddProperty}
            userId={userId}
         />
        <PageWrapper>
            {showAddProperty && (
                <AddProperty userId={userId} />
            )}
        </PageWrapper>
        </>
    );
}

export default AccountDashboard;