import {
    IToolResourceQueryParams,
    IToolResourcesResponse,
    ISingleToolResourceResponse,
} from "@/types/resource.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

// Type for creating/updating tool resource
interface IToolResourcePayload {
    name: string;
    details: string;
    link: string;
}

const toolResourcesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all tool resources with pagination and search
        getToolResources: build.query<IToolResourcesResponse, IToolResourceQueryParams | void>({
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
                    url: `/tool-resource${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.toolResources],
        }),

        // Get single tool resource by ID
        getSingleToolResource: build.query<ISingleToolResourceResponse, string>({
            query: (id) => ({
                url: `/tool-resource/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.toolResources, id }],
        }),

        // Create new tool resource
        createToolResource: build.mutation<ISingleToolResourceResponse, IToolResourcePayload>({
            query: (body) => ({
                url: "/tool-resource",
                method: "POST",
                body,
            }),
            invalidatesTags: [tagTypes.toolResources],
        }),

        // Update tool resource
        updateToolResource: build.mutation<
            ISingleToolResourceResponse,
            { id: string; body: IToolResourcePayload }
        >({
            query: ({ id, body }) => ({
                url: `/tool-resource/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.toolResources,
                { type: tagTypes.toolResources, id },
            ],
        }),
    }),
});

export const {
    useGetToolResourcesQuery,
    useGetSingleToolResourceQuery,
    useCreateToolResourceMutation,
    useUpdateToolResourceMutation,
} = toolResourcesApi;

