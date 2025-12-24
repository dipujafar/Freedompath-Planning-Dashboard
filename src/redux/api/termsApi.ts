import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: () => ({
        url: "/terms",
        method: "GET",
      }),
      providesTags: [tagTypes.terms],
    }),
    updateTerms: builder.mutation({
      query: (data) => ({
        url: "/terms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.terms],
    }),
  }),
});

export const { useGetTermsQuery, useUpdateTermsMutation } = termsApi;
