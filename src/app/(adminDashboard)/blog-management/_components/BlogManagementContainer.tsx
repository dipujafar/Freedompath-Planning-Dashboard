"use client";

import { Eye, EyeOff, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spin, Modal } from "antd";
import {
    useGetBlogsQuery,
    useDeleteBlogMutation,
} from "@/redux/api/blogsApi";
import { IBlog } from "@/types/blog.types";
import { toast } from "sonner";
import { useState } from "react";

export default function BlogManagementContainer() {
    const router = useRouter();
    const { data: blogsData, isLoading, isError } = useGetBlogsQuery();
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

    const handleDeleteClick = (blogId: string) => {
        setSelectedBlogId(blogId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBlogId) return;

        try {
            const result = await deleteBlog(selectedBlogId).unwrap();
            if (result.success) {
                toast.success("Blog deleted successfully!");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete blog");
        } finally {
            setDeleteModalOpen(false);
            setSelectedBlogId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500">
                Failed to load blogs. Please try again.
            </div>
        );
    }

    const blogs = blogsData?.data?.data || [];

    if (blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No blogs found</p>
                <p className="text-sm mt-2">Create your first blog to get started.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6 md:gap-5 gap-4">
                {blogs.map((blog: IBlog) => (
                    <div
                        key={blog.id}
                        className="relative group bg-white rounded-2xl overflow-hidden shadow-sm border border-border-color hover:shadow-md transition-shadow duration-300"
                    >
                        {/* Image Container */}
                        <div
                            className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer"
                            onClick={() => router.push(`/blog-management/${blog.id}`)}
                        >
                            <Image
                                src={blog.image || "/blog_image_1.png"}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/blog_image_1.png";
                                }}
                            />

                            {/* Action Buttons - positioned on image */}
                            <div className="absolute top-3 right-3 flex gap-2 z-20">
                                <button
                                    className="size-9 bg-green-500 flex items-center justify-center text-white rounded-full cursor-pointer hover:bg-green-600 transition-all duration-200 shadow-lg hover:scale-110"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/blog-management/edit/${blog.id}`);
                                    }}
                                    title="Edit Blog"
                                >
                                    <SquarePen size={16} />
                                </button>
                                <button
                                    className="size-9 bg-red-500 flex items-center justify-center text-white rounded-full cursor-pointer hover:bg-red-600 transition-all duration-200 shadow-lg hover:scale-110"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(blog.id);
                                    }}
                                    title="Delete Blog"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div
                                    className={`size-9 flex items-center justify-center text-white rounded-full shadow-lg ${blog.isVisible
                                            ? "bg-black/70"
                                            : "bg-gray-500"
                                        }`}
                                    title={blog.isVisible ? "Visible" : "Hidden"}
                                >
                                    {blog.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </div>
                            </div>

                            {/* Overlay for hidden blogs */}
                            {!blog.isVisible && (
                                <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className="p-4 cursor-pointer"
                            onClick={() => router.push(`/blog-management/${blog.id}`)}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug mb-2">
                                {blog.title}
                            </h2>
                            <p className="text-main-color font-medium text-sm line-clamp-1 mb-3">
                                {blog.subTitle}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <Eye size={14} />
                                    {blog.view} views
                                </span>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${blog.isVisible
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {blog.isVisible ? "Visible" : "Hidden"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Blog"
                open={deleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setSelectedBlogId(null);
                }}
                okText="Delete"
                okButtonProps={{
                    danger: true,
                    loading: isDeleting,
                }}
                cancelButtonProps={{
                    disabled: isDeleting,
                }}
            >
                <p>
                    Are you sure you want to delete this blog? This action cannot be
                    undone.
                </p>
            </Modal>
        </>
    );
}
