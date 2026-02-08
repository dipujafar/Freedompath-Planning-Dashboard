// Content related types (Privacy Policy, Terms and Conditions)

export interface IContent {
    id: string;
    termsAndCondition: string;
    privacyPolicy: string;
    createdAt: string;
    updatedAt: string;
}

export interface IContentResponse {
    success: boolean;
    message: string;
    data: IContent;
}

export interface IContentUpdatePayload {
    privacyPolicy?: string;
    termsAndCondition?: string;
}
