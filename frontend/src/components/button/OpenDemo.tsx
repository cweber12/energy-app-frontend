import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { UserIcon } from "../icons";
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
                    fontSize: "var(--font-base)",
                    marginTop: "var(--space-8)",
                    padding: "0 var(--space-6)",
                    height: "48px",
                    width: "auto",
                }}
                onClick={handleDemoLogin}
                disabled={loading}
            >
                <UserIcon
                    size={20}
                    color="#FFFFFF"
                />
                {loading ? "Signing in..." : "Try the Demo"}
            </CustomButton>
            {message && (
                <p style={{ color: colors.warning, marginTop: "var(--space-3)", textAlign: "center", fontSize: "var(--font-sm)" }}>
                    {message}
                </p>
            )}
        </>
    );
};

export default OpenDemo;