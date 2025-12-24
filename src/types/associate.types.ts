// Associates related types

export interface IAssociate {
    id: string;
    name: string;
    photo: string;
    bio: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IAssociatesMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IAssociatesResponse {
    success: boolean;
    message: string;
    data: {
        data: IAssociate[];
        meta: IAssociatesMeta;
    };
}

export interface ISingleAssociateResponse {
    success: boolean;
    message: string;
    data: IAssociate;
}

export interface IAssociateQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
