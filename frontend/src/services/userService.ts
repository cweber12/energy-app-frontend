// src/services/userService.ts
import { User, RegisterForm } from "../../types/userTypes";

/* Fetch user details by username
--------------------------------------------------------------------------------
Params  | username: The username to look up.
--------------------------------------------------------------------------------
Returns | User object if found, otherwise null.
------------------------------------------------------------------------------*/
export async function fetchUserByUsername(username: string): Promise<User | null> {
    const response = await fetch(`http://127.0.0.1:5000/users/${username}`);
    if (!response.ok) return null;
    const user = await response.json();
    return user;
}

/* Register a new user
--------------------------------------------------------------------------------
Params  | form: RegisterForm object with user details.
--------------------------------------------------------------------------------
Returns | User object of the newly registered user.
------------------------------------------------------------------------------*/
export async function registerUser(form: RegisterForm): Promise<User> {
    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    const data = await response.json();
    return data;
}