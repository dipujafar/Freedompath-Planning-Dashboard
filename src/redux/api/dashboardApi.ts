import {
  IDashboardCardsResponse,
  IDashboardChartResponse,
  IDashboardServicesResponse,
} from "@/types/dashboard.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get dashboard cards data (totalViewers, totalDownloads, totalReports)
    getDashboardCards: build.query<IDashboardCardsResponse, void>({
      query: () => ({
        url: "/dashboard/cards",
        method: "GET",
      }),
      providesTags: [tagTypes.dashboard],
    }),

    // Get dashboard chart data (monthly data)
    getDashboardChart: build.query<IDashboardChartResponse, void>({
      query: () => ({
        url: "/dashboard/chart",
        method: "GET",
      }),
      providesTags: [tagTypes.dashboard],
    }),

    // Get dashboard services list
    getDashboardServices: build.query<IDashboardServicesResponse, void>({
      query: () => ({
        url: "/dashboard/services",
        method: "GET",
      }),
      providesTags: [tagTypes.dashboard, tagTypes.services],
    }),
  }),
});

export const {
  useGetDashboardCardsQuery,
  useGetDashboardChartQuery,
  useGetDashboardServicesQuery,
} = dashboardApi;
