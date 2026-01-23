// src/components/Register.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import FormWrapper from "../common/FormWrapper";

// Define the shape of the form data
type FormData = {
    username: string;
    email: string;
    password: string;
};

/*  Register Component
--------------------------------------------------------------------------------
    Description: A registration form that allows new users to sign up.
------------------------------------------------------------------------------*/
function Register() {
    const { colors } = useTheme();
    const [message, setMessage] = React.useState<string | null>(null);

    // Initialize the form handling
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    
    //
    const fetchUserByUsername = async (username: string) => {
        const response = await fetch(`http://127.0.0.1:5000/users/${username}`);
        if (!response.ok) return null;
        const user = await response.json();
        console.log('Register | Fetched user by username:', user);
        return user;
    };


    const onSubmit = async (data: FormData) => {
        const user = await fetchUserByUsername(data.username);
        if (user) {
            console.log("Register | Username already exists.");
            setMessage("Username already exists. Please choose a different username.");
            return;
        }
        
        await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
            email: data.email
        })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Register | User created:', data);
            setMessage(`Account created for ${data.username}! You can now log in.`);
        })
        .catch(error => {
            console.error('Register | Error :', error);
            setMessage("Registration failed. Please try again.");
        });
    };

    return (
        <FormWrapper>
            <h2>Register</h2>
            <form 
            className="form auth-form"
            style={{width: "300px"}}
            onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("username", { required: true })}
                    placeholder="Username"
                />
                {errors.username && (
                <span style={{ color: colors.warning }}>
                    *Username* is mandatory</span>
                )}
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
                <span style={{ color: colors.warning }}>
                    *Password* is mandatory</span>
                )}

                <input 
                    type="submit" 
                    style={{ 
                        backgroundColor: colors.button, 
                        color: colors.buttonText 
                    }} />
            </form>
            {message && (
                <p style={{ color: colors.warning, marginTop: "1rem" }}>{message}</p>
            )}
        </FormWrapper>
    );
}

export default Register;