// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useNavigate, NavigateFunction } from "react-router-dom";
import "../App.css";
import Login from '../components/form/Login';
import Register from '../components/form/Register';
import HomeHeader from '../components/header/HomeHeader';
import HomeWrapper from '../components/common/HomeWrapper';
import OpenDemo from '../components/button/OpenDemo';
import { useTheme } from '../context/ThemeContext';

/*  Home Page
--------------------------------------------------------------------------------
Description: Landing page for user authentication (login/register).
------------------------------------------------------------------------------*/
function Home() {
    const navigate: NavigateFunction = useNavigate();
    const [showLogin, setShowLogin] = React.useState<boolean>(true);
    const [showRegister, setShowRegister] = React.useState<boolean>(false);
    const userId = sessionStorage.getItem("user_id");
    const { colors } = useTheme();

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
            <HomeWrapper>
                    {showLogin && <Login navigate={navigate} />}
                    {showRegister && <Register />}
                    <span 
                        style={{ 
                            cursor: "pointer",
                            color: colors.title,
                            fontSize: "var(--font-sm)",
                            marginTop: "var(--space-4)",
                            textDecoration: "underline",
                            textUnderlineOffset: "3px",
                        }}
                        onClick={() => {
                            setShowLogin(!showLogin);
                            setShowRegister(!showRegister);
                        }}
                    >
                        {showLogin ? 
                        "Don't have an account? Register here." : 
                        "Already have an account? Login here."}
                    </span>
                    <OpenDemo />
            </HomeWrapper>
        </>
    );
}
export default Home;