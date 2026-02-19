import {
    IBookQueryParams,
    IBooksResponse,
    ISingleBookResponse,
} from "@/types/book.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const booksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all books with pagination and search
        getBooks: build.query<IBooksResponse, IBookQueryParams | void>({
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
                    url: `/books${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.books],
        }),

        // Get single book by ID
        getSingleBook: build.query<ISingleBookResponse, string>({
            query: (id) => ({
                url: `/books/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.books, id }],
        }),

        // Create new book
        createBook: build.mutation<ISingleBookResponse, FormData>({
            query: (formData) => ({
                url: "/books",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [tagTypes.books],
        }),

        // Update book
        updateBook: build.mutation<
            ISingleBookResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/books/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.books,
                { type: tagTypes.books, id },
            ],
        }),

        // Delete book
        deleteBook: build.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/books/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                tagTypes.books,
                { type: tagTypes.books, id },
            ],
        }),
    }),
});

export const {
    useGetBooksQuery,
    useGetSingleBookQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = booksApi;
