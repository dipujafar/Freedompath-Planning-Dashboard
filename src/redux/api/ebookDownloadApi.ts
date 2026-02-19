import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export interface IEbookDownload {
  id: string;
  username: string;
  email: string;
  company: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
  book: {
    id: string;
    name: string;
    details: string;
    image: string;
    file: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IEbookDownloadsResponse {
  success: boolean;
  message: string;
  data: {
    data: IEbookDownload[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface IEbookDownloadQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

const ebookDownloadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEbookDownloads: build.query<IEbookDownloadsResponse, IEbookDownloadQueryParams | void>({
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
          url: `/downloads-book-resources${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.downloadBookResources],
    }),
  }),
});

export const { useGetEbookDownloadsQuery } = ebookDownloadApi;
