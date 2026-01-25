// types/authType.ts

export type LoginForm = {
    email: string;
    password: string;
};

export type LoginResponse = {
    user_id: string;
    username: string;
    email: string;
};