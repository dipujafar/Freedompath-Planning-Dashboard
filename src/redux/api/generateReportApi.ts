import { get } from "http";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tagTypes";

const generateReportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Generate report - requires token from forgot password in header
    getReport: build.query({
      query: (params) => ({
        url: "/generate-report",
        method: "GET",
        params: params,
      }),
      providesTags: [tagTypes.reports],
    }),
    deleteReport: build.mutation({
      query: (id) => ({
        url: `/generate-report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.reports],
    }),
  }),
});

export const { useGetReportQuery, useDeleteReportMutation } = generateReportApi;
