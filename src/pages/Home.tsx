import React from 'react';
import "../App.css";
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import HomeHeader from '../components/headers/HomeHeader';
import { set } from 'react-hook-form';

function Home() {
    const [user, setUser] = React.useState<any>(null);
    const [showLogin, setShowLogin] = React.useState<boolean>(true);
    const [showRegister, setShowRegister] = React.useState<boolean>(false);
    
    return (
        <div>
            <HomeHeader
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                showRegister={showRegister}
                setShowRegister={setShowRegister}
            />
            {showLogin && <Login user={user} setUser={setUser} />}
            {showRegister && <Register />}
        </div>
    );
}
export default Home;