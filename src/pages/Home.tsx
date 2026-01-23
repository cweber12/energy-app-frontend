// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../App.css";
import Login from '../components/form/Login';
import Register from '../components/form/Register';
import HomeHeader from '../components/header/HomeHeader';
import PageWrapper from '../components/common/PageWrapper';
import Card from '../components/common/Card';

/*  Home Page
--------------------------------------------------------------------------------
Description: Landing page for user authentication (login/register).
------------------------------------------------------------------------------*/
function Home() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = React.useState<boolean>(true);
    const [showRegister, setShowRegister] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id");

    useEffect(() => {
        if (userId) {
            navigate("/account");
        }
    }, [userId, navigate]);

    /* Render Home Page
    ----------------------------------------------------------------------------
    Contents:   
        - HomeHeader: Contains title 
        - Card: Contains Login or Register form based on state
    --------------------------------------------------------------------------*/
    return (
        <>
            <HomeHeader/>
            <PageWrapper>
                <Card>
                    {showLogin && <Login navigate={navigate} />}
                    {showRegister && <Register />}
                    <span 
                        style={{ 
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}
                        onClick={() => {
                            setShowLogin(!showLogin);
                            setShowRegister(!showRegister);
                        }}
                    >
                        {showLogin ? "Don't have an account? Register here." : "Already have an account? Login here."}
                    </span>
                </Card>
            </PageWrapper>
        </>
    );
}
export default Home;