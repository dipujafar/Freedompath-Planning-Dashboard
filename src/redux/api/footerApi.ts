import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const footerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFooterContent: builder.query({
      query: () => ({
        url: "/footer-content",
        method: "GET",
      }),
      providesTags: [tagTypes.footerSection],
    }),
    updateFooterContent: builder.mutation({
      query: (data) => ({
        url: "/footer-content",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.footerSection],
    }),
  }),
});

export const { useGetFooterContentQuery, useUpdateFooterContentMutation } = footerApi;
