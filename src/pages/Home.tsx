import React from 'react';
import "../App.css";
import Login from '../components/Login';
import Register from '../components/Register';

function Home() {
    const [user, setUser] = React.useState<any>(null);
    return (
        <div>
            <h1>Home</h1>
            <Login user={user} setUser={setUser} />
            <Register />
        </div>
    );
}
export default Home;