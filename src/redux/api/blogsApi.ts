import {
    IBlogQueryParams,
    IBlogsResponse,
    ISingleBlogResponse,
} from "@/types/blog.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const blogsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all blogs with pagination and search
        getBlogs: build.query<IBlogsResponse, IBlogQueryParams | void>({
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
                    url: `/blogs${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: [tagTypes.blogs],
        }),

        // Get single blog by ID
        getSingleBlog: build.query<ISingleBlogResponse, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.blogs, id }],
        }),

        // Visit/view blog (increments view count)
        visitBlog: build.query<ISingleBlogResponse, string>({
            query: (id) => ({
                url: `/blogs/view/${id}`,
                method: "GET",
            }),
        }),

        // Create new blog
        createBlog: build.mutation<ISingleBlogResponse, FormData>({
            query: (formData) => ({
                url: "/blogs",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [tagTypes.blogs],
        }),

        // Update blog
        updateBlog: build.mutation<
            ISingleBlogResponse,
            { id: string; formData: FormData }
        >({
            query: ({ id, formData }) => ({
                url: `/blogs/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                tagTypes.blogs,
                { type: tagTypes.blogs, id },
            ],
        }),

        // Delete blog
        deleteBlog: build.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.blogs],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetSingleBlogQuery,
    useVisitBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogsApi;
