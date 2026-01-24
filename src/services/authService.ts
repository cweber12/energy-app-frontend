export type LoginResponse = {
    user_id: string;
    username: string;
    email: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}