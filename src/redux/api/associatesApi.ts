import {
    IAssociateQueryParams,
    IAssociatesResponse,
    ISingleAssociateResponse,
} from "@/types/associate.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const associatesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all associates with pagination and search
        getAssociates: build.query<IAssociatesResponse, IAssociateQueryParams | void>({
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
                    url: `/associates${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.associates],
        }),

        // Get single associate by ID
        getSingleAssociate: build.query<ISingleAssociateResponse, string>({
            query: (id) => ({
                url: `/associates/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.associates, id }],
        }),

        // Create new associate
        createAssociate: build.mutation<ISingleAssociateResponse, FormData>({
            query: (formData) => ({
                url: "/associates",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [tagTypes.associates],
        }),

        // Update associate
        updateAssociate: build.mutation<
            ISingleAssociateResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/associates/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.associates,
                { type: tagTypes.associates, id },
            ],
        }),
    }),
});

export const {
    useGetAssociatesQuery,
    useGetSingleAssociateQuery,
    useCreateAssociateMutation,
    useUpdateAssociateMutation,
} = associatesApi;
