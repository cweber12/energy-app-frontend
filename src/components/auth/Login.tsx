// src/components/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "../Components.css";
import FormWrapper from "../common/FormWrapper";

// Define the shape of the form data
type FormData = {
    email: string;
    password: string;
};

/*  Login Component
--------------------------------------------------------------------------------
    Description: A login form that authenticates users.
------------------------------------------------------------------------------*/
function Login() {
    const navigate = useNavigate(); // Hook for navigation
    const { colors, scheme } = useTheme(); // Get theme colors

    // Initialize the form handling
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    // Function to handle form submission
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
                sessionStorage.setItem("username", data.username);
                navigate("/account");
            })
            .catch(err => console.error(err));
            
    };

    return (
        <FormWrapper>
            <form 
            className="form" 
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
                    style={{ 
                        backgroundColor: colors.button, 
                        color: colors.buttonText 
                    }} />
            </form>
        </FormWrapper>
    );
}

export default Login;