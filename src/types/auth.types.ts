// Auth related types

export interface IUser {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive" | "blocked";
    role: "admin";
    profile: string | null;
    phoneNumber: string | null;
    customerId: string | null;
    expireAt: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    verification: {
        status: boolean;
    };
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        accessToken: string;
        refreshToken: string;
    };
}

export interface IAuthState {
    user: IUser | null;
    token: string | null;
}

// Generic API error response
export interface IApiError {
    success: boolean;
    message: string;
    errorMessages?: Array<{
        path: string;
        message: string;
    }>;
}

// Forgot password response
export interface IForgotPasswordResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        token: string;
    };
}

// Verify OTP response
export interface IVerifyOtpResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        token: string;
    };
}

// Resend OTP response
export interface IResendOtpResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
    };
}

// Change password response
export interface IChangePasswordResponse {
    success: boolean;
    message: string;
    data: IUser;
}

// Change password request
export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

