// About Us Management Types

// ==================== About Hero Section ====================
export interface IAboutHeroSection {
    id: string;
    key: string;
    title: string;
    subTitle: string;
    projects: number;
    experience: number;
    clientReview: number;
    description: string;
    banner: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAboutHeroSectionResponse {
    success: boolean;
    message: string;
    data: IAboutHeroSection;
}

export interface IAboutHeroSectionUpdateData {
    title: string;
    subTitle: string;
    projects: number;
    experience: number;
    clientReview: number;
    description: string;
}

// ==================== Freedom Path Planning ====================
export interface IFreedomPathOption {
    id?: string;
    title: string;
    subTitle: string;
    createdAt?: string;
    updatedAt?: string;
    parentId?: string;
}

export interface IFreedomPathPlanning {
    id: string;
    key: string;
    title: string;
    banner: string;
    createdAt: string;
    updatedAt: string;
    options: IFreedomPathOption[];
}

export interface IFreedomPathPlanningResponse {
    success: boolean;
    message: string;
    data: IFreedomPathPlanning;
}

export interface IFreedomPathPlanningUpdateData {
    title: string;
    options: Array<{
        title: string;
        subTitle: string;
    }>;
}

// ==================== About Steve Deray (Business Owner) ====================
export interface IAboutSteveDeray {
    id: string;
    key: string;
    title: string;
    bio: string;
    sectionTitle: string;
    banner: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAboutSteveDerayResponse {
    success: boolean;
    message: string;
    data: IAboutSteveDeray;
}

export interface IAboutSteveDerayUpdateData {
    title: string;
    bio: string;
}
