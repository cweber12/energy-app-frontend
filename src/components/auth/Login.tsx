// src/components/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "./AuthForm.css";

// Define the shape of the form data
type FormData = {
    email: string;
    password: string;
};

/*  Login Component
--------------------------------------------------------------------------------
    Description: A login form that authenticates users.
------------------------------------------------------------------------------*/
function Login(
    { user,
    setUser,
    }: {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    }
) {
    // Access the current theme colors and scheme
    const { colors, scheme } = useTheme();

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
                setUser(data.username);
            })
            .catch(err => console.error(err));
    };

    return (
        <div 
            className="form-container"
            style={{ backgroundColor: colors.background }}
            >
            <h2 style={{color: colors.title}}>Login</h2>
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
        </div>
    );
}

export default Login;