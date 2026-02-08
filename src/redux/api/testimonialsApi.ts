import {
    ITestimonialQueryParams,
    ITestimonialsResponse,
    ISingleTestimonialResponse,
} from "@/types/testimonial.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const testimonialsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all testimonials with pagination and search
        getTestimonials: build.query<ITestimonialsResponse, ITestimonialQueryParams | void>({
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
                    url: `/testimonial${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.testimonials],
        }),

        // Get single testimonial by ID
        getSingleTestimonial: build.query<ISingleTestimonialResponse, string>({
            query: (id) => ({
                url: `/testimonial/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.testimonials, id }],
        }),

        // Create new testimonial
        createTestimonial: build.mutation<ISingleTestimonialResponse, FormData>({
            query: (formData) => ({
                url: "/testimonial",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [tagTypes.testimonials],
        }),

        // Update testimonial
        updateTestimonial: build.mutation<
            ISingleTestimonialResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/testimonial/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.testimonials,
                { type: tagTypes.testimonials, id },
            ],
        }),
    }),
});

export const {
    useGetTestimonialsQuery,
    useGetSingleTestimonialQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
} = testimonialsApi;

