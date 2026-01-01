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
    whatYourClientGets?: IWhatYourClientGets;
    includedServices: any[];
}

export interface IServiceOption {
    id: string;
    title: string;
    subTitle: string;
    createdAt: string;
    updatedAt: string;
    parentId: string;
}

export interface IWhatYourClientGets {
    id: string;
    serviceId: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    options: IServiceOption[];
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

export interface ISingleServiceResponse {
    success: boolean;
    message: string;
    data: IService;
}

export interface IServiceQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
