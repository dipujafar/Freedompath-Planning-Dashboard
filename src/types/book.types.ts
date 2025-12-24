// Book Management related types

export interface IBook {
    id: string;
    name: string;
    price: number;
    downloads: number;
    image: string;
    file: string;
    details: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IBookMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IBooksResponse {
    success: boolean;
    message: string;
    data: {
        data: IBook[];
        meta: IBookMeta;
    };
}

export interface ISingleBookResponse {
    success: boolean;
    message: string;
    data: IBook;
}

export interface IBookQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
