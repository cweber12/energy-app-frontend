// src/components/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import FormWrapper from "../common/FormWrapper";
import { NavigateFunction } from "react-router-dom";

// Define the shape of the form data
type FormData = {
    email: string;
    password: string;
};

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
    } = useForm<FormData>();

    // Consolidate button styling
    const buttonProps = {
        style: {
            backgroundColor: colors.button,
            color: colors.buttonText,
        }
    };
    
    /* Handle form submission to authenticate user
    ----------------------------------------------------------------------------
    - Sends POST request with email and password
    --------------------------------------------------------------------------*/
    const onSubmit = async (data: FormData) => {
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
            })
            .then(res => res.json())
            .then(data => {
                console.log('Login | Login successful:', data);
                if (data.email) {
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("user_id", data.user_id);
                    navigate("/account");
                } else {
                    sessionStorage.removeItem("username");
                    console.warn('Login | Username missing in response');
                    setMessage("Login failed. Please check your credentials and try again.");
                }
            })
            .catch(err => {
                console.error('Login | Error during login:', err);
                setMessage("Login failed. Please check your credentials and try again.");
            });
            
    };

    /* Render login form
    ----------------------------------------------------------------------------
    Fields: Email, Password
    Buttons: Submit
    Displays error message if login fails
    --------------------------------------------------------------------------*/
    return (
        <FormWrapper>
            <h2>Login</h2>
            <form 
            className="form auth-form" 
            style={{width: "300px"}}
            onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {errors.email && (
                <span style={{ color: colors.warning }}>
                    *Email* is mandatory</span>
                )}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {errors.password && (
                <span style={{ color: colors.warning }}>*Password* is mandatory</span>
                )}

                <input 
                    type="submit" 
                    {...buttonProps} />
            </form>
            {message && (
                <p 
                style={{ 
                    color: colors.warning, 
                    marginTop: "10px", 
                    width: "300px" 
                }}>
                    {message}
                </p>
            )}
        </FormWrapper>
    );
}

export default Login;