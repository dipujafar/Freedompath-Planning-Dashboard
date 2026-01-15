import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export interface IDownloadBook {
    id: string;
    username: string;
    email: string;
    company: string;
    bookId: string;
    createdAt: string;
    updatedAt: string;
    book: {
        id: string;
        name: string;
        details: string;
        image: string;
        file: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export interface IDownloadBooksResponse {
    success: boolean;
    message: string;
    data: {
        data: IDownloadBook[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    };
}

export interface IDownloadBookQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const downloadBooksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getDownloadBooks: build.query<IDownloadBooksResponse, IDownloadBookQueryParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();

                if (params?.page) {
                    queryParams.append("page", params.page.toString());
                }
                if (params?.limit) {
                    queryParams.append("limit", params.limit.toString());
                }
                if (params?.searchTerm) {
                    queryParams.append("searchTerm", params.searchTerm);
                }

                const queryString = queryParams.toString();
                return {
                    url: `/downloads-book${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.downloadBooks],
        }),
    }),
});

export const { useGetDownloadBooksQuery } = downloadBooksApi;
