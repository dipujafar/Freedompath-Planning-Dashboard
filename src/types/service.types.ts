// Service related types

export interface IService {
    id: string;
    serviceName: string;
    Title: string;
    subTitle: string;
    image: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IServicesResponse {
    success: boolean;
    message: string;
    data: {
        data: IService[];
        meta: IMeta;
    };
}

export interface IServiceQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
