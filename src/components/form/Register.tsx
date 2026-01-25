// src/components/Register.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import { fetchUserByUsername, registerUser } from "../../services/userService";
import { RegisterForm } from "../../../types/userTypes";
import "../../App.css";
import "../Components.css";
import FormWrapper from "../common/FormWrapper";
/*  Register Component
--------------------------------------------------------------------------------
Description: A registration form that allows new users to sign up.
------------------------------------------------------------------------------*/
const Register: React.FC = () => {
    const { colors } = useTheme();
    const [message, setMessage] = React.useState<string | null>(null);

    // Initialize the form handling
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>();

    /* Handle form submission to register new user
    ----------------------------------------------------------------------------
    - fetchUserByUsername checks if username already exists
    - If not, registerUser sends POST request to create new user
    --------------------------------------------------------------------------*/
    const onSubmit = async (data: RegisterForm) => {
        const user = await fetchUserByUsername(data.username);
        if (user) {
            console.log("Register | Username already exists.");
            setMessage("Username already exists. Please choose a different username.");
            return;
        } else {
        
            try {
                const newUser = await registerUser({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                });
                console.log('Register | User created:', newUser);
                setMessage(`Account created for ${data.username}! You can now log in.`);
            } catch (error) {
                console.error('Register | Error :', error);
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Registration failed. Please try again."
                );
            }
        }
    };

    /* Render registration form
    ----------------------------------------------------------------------------
    Fields: Username, Email, Password
    Buttons: Submit
    Displays success/error message
    --------------------------------------------------------------------------*/
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