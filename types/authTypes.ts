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

export type RegisterResult = {
  userId: string | null;
  email: string | null;
  sessionExists: boolean;
  errorMessage: string | null;
};