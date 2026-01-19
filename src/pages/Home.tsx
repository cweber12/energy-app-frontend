import React from 'react';
import "../App.css";
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import HomeHeader from '../components/headers/HomeHeader';
import PageWrapper from '../components/common/PageWrapper';

function Home() {
    const [showLogin, setShowLogin] = React.useState<boolean>(true);
    const [showRegister, setShowRegister] = React.useState<boolean>(false);
    
    return (
        <>
            <HomeHeader
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                showRegister={showRegister}
                setShowRegister={setShowRegister}
            />
            <PageWrapper>
            {showLogin && <Login/>}
            {showRegister && <Register />}
        </PageWrapper>
        </>
    );
}
export default Home;