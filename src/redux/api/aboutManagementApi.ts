import {
    IAboutHeroSectionResponse,
    IFreedomPathPlanningResponse,
    IAboutSteveDerayResponse,
} from "@/types/about.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const aboutManagementApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // ==================== About Hero Section ====================
        getAboutHeroSection: build.query<IAboutHeroSectionResponse, string>({
            query: (id) => ({
                url: `/about-hero-section/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.aboutHeroSection],
        }),

        updateAboutHeroSection: build.mutation<
            IAboutHeroSectionResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/about-hero-section/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: [tagTypes.aboutHeroSection],
        }),

        // ==================== Freedom Path Planning ====================
        getFreedomPathPlanning: build.query<IFreedomPathPlanningResponse, string>({
            query: (id) => ({
                url: `/freedom-path-planning/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.freedomPathPlanning],
        }),

        updateFreedomPathPlanning: build.mutation<
            IFreedomPathPlanningResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/freedom-path-planning/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: [tagTypes.freedomPathPlanning],
        }),

        // ==================== About Steve Deray (Business Owner) ====================
        getAboutSteveDeray: build.query<IAboutSteveDerayResponse, string>({
            query: (id) => ({
                url: `/about-steve-deray/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.aboutSteveDeray],
        }),

        updateAboutSteveDeray: build.mutation<
            IAboutSteveDerayResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/about-steve-deray/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: [tagTypes.aboutSteveDeray],
        }),
    }),
});

export const {
    // About Hero Section
    useGetAboutHeroSectionQuery,
    useUpdateAboutHeroSectionMutation,
    // Freedom Path Planning
    useGetFreedomPathPlanningQuery,
    useUpdateFreedomPathPlanningMutation,
    // About Steve Deray
    useGetAboutSteveDerayQuery,
    useUpdateAboutSteveDerayMutation,
} = aboutManagementApi;
