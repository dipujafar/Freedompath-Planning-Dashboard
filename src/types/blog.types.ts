// Blog Management related types

export interface IBlog {
    id: string;
    title: string;
    subTitle: string;
    image: string;
    details: string;
    view: number;
    isVisible: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IBlogMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IBlogsResponse {
    success: boolean;
    message: string;
    data: {
        data: IBlog[];
        meta: IBlogMeta;
    };
}

export interface ISingleBlogResponse {
    success: boolean;
    message: string;
    data: IBlog;
}

export interface IBlogQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

export interface IBlogFormData {
    title: string;
    subTitle: string;
    details: string;
    isVisible: boolean;
}
