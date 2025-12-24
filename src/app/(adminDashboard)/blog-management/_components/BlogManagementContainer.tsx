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
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-9 md:gap-5 gap-3">
                {blogs.map((blog: IBlog) => (
                    <div key={blog.id} className="relative group">
                        <div
                            className="lg:space-y-6 md:space-y-4 space-y-2.5 cursor-pointer"
                            onClick={() => router.push(`/blog-management/${blog.id}`)}
                        >
                            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
                                <Image
                                    src={blog.image || "/blog_image_1.png"}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/blog_image_1.png";
                                    }}
                                />
                            </div>
                            <div className="lg:space-y-1.5 space-y-1">
                                <h1 className="xl:text-xl md:text-lg font-semibold xl:leading-7 leading-6 line-clamp-2">
                                    {blog.title}
                                </h1>
                                <p className="text-main-color font-medium line-clamp-1">
                                    {blog.subTitle}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{blog.view} views</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-x-2.5 z-20">
                            <div
                                className="size-8 bg-green-500 flex-center text-white rounded-full cursor-pointer hover:bg-green-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/blog-management/edit/${blog.id}`);
                                }}
                                title="Edit Blog"
                            >
                                <SquarePen size={18} />
                            </div>
                            <div
                                className="size-8 bg-red-500 flex-center text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(blog.id);
                                }}
                                title="Delete Blog"
                            >
                                <Trash2 size={18} />
                            </div>
                            <div
                                className={`size-8 ${blog.isVisible ? "bg-black" : "bg-gray-400"
                                    } flex-center text-white rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
                                title={blog.isVisible ? "Visible" : "Hidden"}
                            >
                                {blog.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </div>
                        </div>

                        {/* Overlay for hidden blogs */}
                        {!blog.isVisible && (
                            <div className="absolute inset-0 bg-black/20 rounded-2xl z-10 pointer-events-none" />
                        )}
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
                <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
            </Modal>
        </>
    );
}
