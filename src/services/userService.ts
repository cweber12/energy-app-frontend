// src/services/userService.ts

// Type definition for User object
export type User = {
    user_id: string;
    username: string;
    email: string;
};

// Type definition for RegisterForm
export type RegisterForm = {
    username: string;
    password: string;
    email: string;
};

/* Fetch user details by username
--------------------------------------------------------------------------------
Params  | username: The username to look up.
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
Params  | form: RegisterForm containing username, password, and email.
Returns | Newly created User object.
------------------------------------------------------------------------------*/
export async function registerUser(form: RegisterForm): Promise<User> {
    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
        // If backend sends an error message, throw it
        throw new Error(data.error || "Registration failed");
    }
    return data;
}