import { baseApi } from "./baseApi";
import { tagTypes } from "../tagTypes";

const homePageApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        updateHeroSection: build.mutation<void, FormData>({
            query: (data) => ({
                url: "/homePageContents/hero-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateServiceSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/service-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateServicePageSettings: build.mutation<void, FormData>({
            query: (data) => ({
                url: "/homePageContents/service-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateServiceDetailsIncludedSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/service-details-page-whats-included-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateBlogSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/service-details-page-blog-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
    }),
    overrideExisting: false,
});

export { homePageApi };

export const {
    useUpdateHeroSectionMutation,
    useUpdateServiceSectionMutation,
    useUpdateServicePageSettingsMutation,
    useUpdateServiceDetailsIncludedSectionMutation,
    useUpdateBlogSectionMutation,
} = homePageApi;
