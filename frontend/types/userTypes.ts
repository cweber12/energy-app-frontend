// types/userTypes.ts

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
