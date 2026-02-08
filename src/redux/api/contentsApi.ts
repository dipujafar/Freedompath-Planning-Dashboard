import {
    IContentResponse,
    IContentUpdatePayload,
} from "@/types/content.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const contentsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get contents (Privacy Policy and Terms & Conditions)
        getContents: build.query<IContentResponse, void>({
            query: () => ({
                url: "/contents",
                method: "GET",
            }),
            providesTags: [tagTypes.content],
        }),

        // Update contents (Privacy Policy and/or Terms & Conditions)
        updateContents: build.mutation<IContentResponse, IContentUpdatePayload>({
            query: (body) => ({
                url: "/contents",
                method: "PATCH",
                body,
            }),
            invalidatesTags: [tagTypes.content],
        }),
    }),
});

export const { useGetContentsQuery, useUpdateContentsMutation } = contentsApi;
