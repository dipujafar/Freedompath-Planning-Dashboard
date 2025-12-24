import {
    IBookResourceQueryParams,
    IBookResourcesResponse,
    ISingleBookResourceResponse,
} from "@/types/resource.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const bookResourcesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all book resources with pagination and search
        getBookResources: build.query<IBookResourcesResponse, IBookResourceQueryParams | void>({
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
                    url: `/book-resources${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.bookResources],
        }),

        // Get single book resource by ID
        getSingleBookResource: build.query<ISingleBookResourceResponse, string>({
            query: (id) => ({
                url: `/book-resources/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.bookResources, id }],
        }),

        // Create new book resource
        createBookResource: build.mutation<ISingleBookResourceResponse, FormData>({
            query: (formData) => ({
                url: "/book-resources",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [tagTypes.bookResources],
        }),

        // Update book resource
        updateBookResource: build.mutation<
            ISingleBookResourceResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/book-resources/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.bookResources,
                { type: tagTypes.bookResources, id },
            ],
        }),
    }),
});

export const {
    useGetBookResourcesQuery,
    useGetSingleBookResourceQuery,
    useCreateBookResourceMutation,
    useUpdateBookResourceMutation,
} = bookResourcesApi;

