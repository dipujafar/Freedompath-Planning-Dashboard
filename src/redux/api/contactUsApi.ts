import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

interface IContactUsBannerPayload {
    banner: {
        title: string;
        subTitle: string;
    };
}

interface IContactUsResponse {
    success: boolean;
    message: string;
    data: {
        banner: string;   // image URL returned
        title: string;
        subTitle: string;
    };
}

const contactUsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getContactUsContent: build.query<IContactUsResponse, void>({
            query: () => ({
                url: "/contact-us-page-contents",
                method: "GET",
            }),
            providesTags: [tagTypes.contactUs],
        }),

        updateContactUsContent: build.mutation<IContactUsResponse, FormData>({
            query: (formData) => ({
                url: "/contact-us-page-contents",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: [tagTypes.contactUs],
        }),
    }),
});

export const {
    useGetContactUsContentQuery,
    useUpdateContactUsContentMutation,
} = contactUsApi;
