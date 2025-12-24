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
