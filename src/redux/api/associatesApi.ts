import {
    IAssociateQueryParams,
    IAssociatesResponse,
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
    }),
});

export const { useGetAssociatesQuery } = associatesApi;
