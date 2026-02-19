import { baseApi } from "./baseApi";
import { tagTypes } from "../tagTypes";

const homePageApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getHeroSection: build.query<any, void>({
            query: () => "/homePageContents/hero-section",
            providesTags: [tagTypes.homePage]
        }),
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
        getServiceSection: build.query<any, void>({
            query: () => "/homePageContents/service-section",
            providesTags: [tagTypes.homePage]
        }),
        getBlogSection: build.query<any, void>({
            query: () => "/homePageContents/service-details-page-blog-section",
            providesTags: [tagTypes.homePage]
        }),
        getResourceSection: build.query<any, void>({
            query: () => "/homePageContents/resources-section",
            providesTags: [tagTypes.homePage]
        }),
        getLearnAndGrowSection: build.query<any, void>({
            query: () => "/homePageContents/learn-and-grow-with-our-books-section",
            providesTags: [tagTypes.homePage]
        }),
        getTestimonialSection: build.query<any, void>({
            query: () => "/homePageContents/testimonial-section",
            providesTags: [tagTypes.homePage]
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
        updateResourceSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/resources-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateLearnAndGrowSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/learn-and-grow-with-our-books-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateTestimonialSection: build.mutation<void, any>({
            query: (data) => ({
                url: "/homePageContents/testimonial-section",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        getHeroButtons: build.query<any, void>({
            query: () => "/hero-buttons",
            providesTags: [tagTypes.homePage]
        }),
        addHeroButton: build.mutation<void, any>({
            query: (data) => ({
                url: "/hero-buttons",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        updateHeroButton: build.mutation<void, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `/hero-buttons/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        deleteHeroButton: build.mutation<void, string>({
            query: (id) => ({
                url: `/hero-buttons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.homePage]
        }),
        getResourcesPage: build.query<any, void>({
            query: () => "/homePageContents/resources-page",
            providesTags: [tagTypes.homePage]
        }),
        updateResourcesPage: build.mutation<void, FormData>({
            query: (data) => ({
                url: "/homePageContents/resources-page",
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
    useGetHeroSectionQuery,
    useGetHeroButtonsQuery,
    useUpdateHeroSectionMutation,
    useUpdateServiceSectionMutation,
    useGetServiceSectionQuery,
    useGetBlogSectionQuery,
    useGetResourceSectionQuery,
    useGetLearnAndGrowSectionQuery,
    useGetTestimonialSectionQuery,
    useUpdateServicePageSettingsMutation,
    useUpdateServiceDetailsIncludedSectionMutation,
    useUpdateBlogSectionMutation,
    useUpdateResourceSectionMutation,
    useUpdateLearnAndGrowSectionMutation,
    useUpdateTestimonialSectionMutation,
    useAddHeroButtonMutation,
    useUpdateHeroButtonMutation,
    useDeleteHeroButtonMutation,
    useGetResourcesPageQuery,
    useUpdateResourcesPageMutation,
} = homePageApi;
