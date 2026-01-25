// src/services/authService.ts
import { LoginResponse } from "../../types/authType";

/* User Login
--------------------------------------------------------------------------------
Params  | email: User's email address.
        | password: User's password.
--------------------------------------------------------------------------------
Returns | LoginResponse containing user details.
------------------------------------------------------------------------------*/

export async function login(
    email: string, 
    password: string
): Promise<LoginResponse> {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}