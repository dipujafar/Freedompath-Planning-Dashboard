import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: "/about",
        method: "GET",
      }),
      providesTags: [tagTypes.about],
    }),
    updateAbout: builder.mutation({
      query: (data) => ({
        url: "/about",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.about],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;
