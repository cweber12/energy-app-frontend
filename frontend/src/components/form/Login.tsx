// src/components/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import { LoginForm } from "../../../types/authTypes";
import { supabase } from "../../lib/supabaseClient";
import "../../App.css";
import "../../styles/Components.css";
import AuthFormWrapper from "../common/AuthFormWrapper";
import { NavigateFunction } from "react-router-dom";
import CustomButton from "../button/CustomButton";

/*  Login Component
--------------------------------------------------------------------------------
Description: A login form that authenticates users.
Props: 
    - navigate: Function to navigate to AccountDashboard on successful login.
------------------------------------------------------------------------------*/
const Login: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) =>  {
    const { colors } = useTheme(); // Get theme colors
    const [message, setMessage] = React.useState<string | null>(null);

    // Initialize the form handling
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    /* Handle form submission to authenticate user
    ----------------------------------------------------------------------------
    - Sends POST request with email and password
    --------------------------------------------------------------------------*/
    const onSubmit = async (formData: LoginForm) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (data.user) {
                sessionStorage.setItem("user_id", data.user.id);
                sessionStorage.setItem("username", data.user.user_metadata.username);
                navigate("/account");
            } else if (error) {
                setMessage(error.message);
            }
        } catch (err) {
            console.error('Login | Error during login:', err);
            setMessage("Login failed. Please check your credentials and try again.");
        }

       
    };

    /* Render login form
    ----------------------------------------------------------------------------
    Fields: Email, Password
    Buttons: Submit
    Displays error message if login fails
    --------------------------------------------------------------------------*/
    return (
        <AuthFormWrapper>
            <h2 style={{ 
                marginBottom: "var(--space-4)",
                fontSize: "var(--font-xl)",
                color: colors.primaryText,
            }}>Sign In</h2>
            <form 
                className="form auth-form" 
                onSubmit={handleSubmit(onSubmit)}
            >
                <label className="form-label">
                    Email
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="Email address"
                    />
                    {errors.email && (
                        <span style={{ color: colors.warning, fontSize: "var(--font-xs)" }}>
                            Email is required
                        </span>
                    )}
                </label>

                <label className="form-label">
                    Password
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        placeholder="Password"
                    />
                    {errors.password && (
                        <span style={{ color: colors.warning, fontSize: "var(--font-xs)" }}>
                            Password is required
                        </span>
                    )}
                </label>

                <CustomButton 
                    type="submit"
                    style={{ marginTop: "var(--space-3)", width: "100%", height: "44px", fontSize: "var(--font-base)" }}
                >
                    Sign In
                </CustomButton>
            </form>
            {message && (
                <p style={{ 
                    color: colors.warning, 
                    marginTop: "var(--space-3)",
                    fontSize: "var(--font-sm)",
                }}>
                    {message}
                </p>
            )}
        </AuthFormWrapper>
    );
}

export default Login;