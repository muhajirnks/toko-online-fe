export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    store?: Store;
}

export interface Store {
    _id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
}

export interface Token {
    type: 'Bearer';
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    fcmToken: string;
}

export interface LoginResponse {
    message: string;
    token: Token
    data: User
}

export interface ForgotPasswordRequest {
    email: string
    verifyEmailUrl: string;
}

export interface ResetPasswordRequest {
    token: string
    password: string
}

export interface UpdateProfileRequest {
    name: string
    email: string
}

export interface UpdatePasswordRequest {
    oldPassword: string
    newPassword: string
}
