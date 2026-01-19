import React from "react";
import { useForm } from "react-hook-form";
import "../App.css";

type FormData = {
    username: string;
    email: string;
    password: string;
};

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    
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
            console.log("Register | Username already exists. Please choose a different username.");
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
        })
        .catch(error => {
            console.error('Register | Error :', error);
        });
    };

    return (
        <>
            <h2>Registration Form</h2>

            <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("username", { required: true })}
                    placeholder="Username"
                />
                {errors.username && <span style={{ color: "red" }}>*Username* is mandatory</span>}

                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
            </form>
        </>
    );
}

export default Register;