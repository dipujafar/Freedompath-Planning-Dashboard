import { IProfileResponse } from "@/types/profile.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get my profile
    getMyProfile: build.query<IProfileResponse, void>({
      query: () => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),

    // Update my profile
    updateMyProfile: build.mutation<IProfileResponse, FormData>({
      query: (formData) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = profileApi;
