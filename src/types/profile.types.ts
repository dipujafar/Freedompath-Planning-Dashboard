// Profile/User related types

export interface IDeviceHistory {
    id: string;
    userId: string;
    ip: string;
    browser: string | null;
    os: string | null;
    device: string;
    createdAt: string;
    updatedAt: string;
}

export interface IProfile {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive" | "blocked";
    role: "admin";
    profile: string | null;
    phoneNumber: string | null;
    createdAt: string;
    verification: {
        status: boolean;
    };
    deviceHistory?: IDeviceHistory[];
}

export interface IProfileResponse {
    success: boolean;
    message: string;
    data: IProfile;
}

export interface IUpdateProfilePayload {
    name: string;
    phoneNumber: string;
}
