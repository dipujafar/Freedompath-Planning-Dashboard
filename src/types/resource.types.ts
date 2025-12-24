// Tool Resource related types

export interface IToolResource {
    id: string;
    name: string;
    details: string;
    link: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IToolResourceMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IToolResourcesResponse {
    success: boolean;
    message: string;
    data: {
        data: IToolResource[];
        meta: IToolResourceMeta;
    };
}

export interface ISingleToolResourceResponse {
    success: boolean;
    message: string;
    data: IToolResource;
}

export interface IToolResourceQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

// Book Resource related types

export interface IBookResource {
    id: string;
    name: string;
    details: string;
    image: string;
    file: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IBookResourceMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IBookResourcesResponse {
    success: boolean;
    message: string;
    data: {
        data: IBookResource[];
        meta: IBookResourceMeta;
    };
}

export interface ISingleBookResourceResponse {
    success: boolean;
    message: string;
    data: IBookResource;
}

export interface IBookResourceQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
