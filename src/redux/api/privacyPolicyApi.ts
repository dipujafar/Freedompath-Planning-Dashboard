import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const privacyPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/privacy",
        method: "GET",
      }),
      providesTags: [tagTypes.privacyPolicy],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/privacy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.privacyPolicy],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } =
  privacyPolicyApi;
