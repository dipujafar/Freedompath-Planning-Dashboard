import {
    IServiceQueryParams,
    IServicesResponse,
    ISingleServiceResponse,
} from "@/types/service.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const servicesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all services with pagination and search
        getServices: build.query<IServicesResponse, IServiceQueryParams | void>({
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
                    url: `/services${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.services],
        }),

        // Get single service by ID
        getSingleService: build.query<ISingleServiceResponse, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.services, id }],
        }),

        // Create new service
        createService: build.mutation<ISingleServiceResponse, FormData>({
            query: (data) => ({
                url: "/services",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [tagTypes.services],
        }),

        // Update service
        updateService: build.mutation<
            ISingleServiceResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/services/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.services,
                { type: tagTypes.services, id },
            ],
        }),

        // Delete service
        deleteService: build.mutation<void, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.services],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetSingleServiceQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;


