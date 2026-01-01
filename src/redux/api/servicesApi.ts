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
        createService: build.mutation<ISingleServiceResponse, any>({
            query: (data) => ({
                url: "/services",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [tagTypes.services],
        }),
    }),
});

export const { useGetServicesQuery, useGetSingleServiceQuery, useCreateServiceMutation } = servicesApi;

