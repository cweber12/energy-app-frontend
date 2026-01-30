import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FaRegCircleUser } from "react-icons/fa6";
import "../../styles/Components.css";
import CustomButton from "./CustomButton";

const OpenDemo: React.FC = () => {
    const { colors } = useTheme();
    const navigate = useNavigate();
    const [message, setMessage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleDemoLogin = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: "demo@demo.com",
                password: "123456",
            });
            if (data.user) {
                sessionStorage.setItem("user_id", data.user.id);
                sessionStorage.setItem("username", data.user.user_metadata.username || "Demo User");
                navigate("/account");
            } else if (error) {
                setMessage(error.message);
            }
        } catch (err) {
            console.error('Login | Error during login:', err);
            setMessage("Login failed. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomButton
                style={{ 
                    fontSize: "1.5rem",
                    marginTop: "2rem",
                    padding: "0.5rem 1rem",
                    width: 320, 
                    height: 80,
                }}
                onClick={handleDemoLogin}
                disabled={loading}
            >
                <FaRegCircleUser
                size={40} 
                style={{ marginRight: "1rem" }} />
                {loading ? "Logging in..." : "Open Demo Account"}
            </CustomButton>
            {message && (
                <p style={{ color: colors.warning, marginTop: "1rem", textAlign: "center" }}>
                    {message}
                </p>
            )}
        </>
    );
};

export default OpenDemo;