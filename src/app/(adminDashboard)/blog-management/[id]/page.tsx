"use client";

import { useGetSingleBlogQuery } from "@/redux/api/blogsApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    EyeOff,
    FileText,
} from "lucide-react";
import { Spin } from "antd";
import Image from "next/image";
import dayjs from "dayjs";

const BlogDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const blogId = params.id as string;

    const {
        data: blogData,
        isLoading,
        isError,
    } = useGetSingleBlogQuery(blogId, {
        skip: !blogId,
    });

    const blog = blogData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !blog) {
        return (
            <div className="min-h-screen bg-background border border-border-color rounded-xl p-6">
                <div className="mb-6 flex items-center gap-2">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Blog Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load blog details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The blog may not exist or there was an error loading the data.
                    </p>
                    <Button
                        onClick={() => router.back()}
                        className="mt-4 bg-main-color hover:bg-secondary-color hover:text-black"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background border border-border-color rounded-xl">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-2">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Blog Details</h1>
                </div>

                {/* Content */}
                <div className="space-y-6 max-w-4xl">
                    {/* Blog Cover Image */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border-color bg-section-bg">
                        <Image
                            src={blog.image || "/blog_image_1.png"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/blog_image_1.png";
                            }}
                        />
                    </div>

                    {/* Title Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-main-color/10 rounded-lg">
                                <FileText className="h-5 w-5 text-main-color" />
                            </div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Title
                            </label>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mt-2">
                            {blog.title}
                        </h2>
                    </div>

                    {/* Subtitle Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Subtitle
                        </label>
                        <p className="text-lg text-foreground mt-2 font-medium">
                            {blog.subTitle}
                        </p>
                    </div>

                    {/* Views and Visibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Views Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Total Views
                                    </label>
                                    <p className="text-2xl font-bold text-blue-600">{blog.view}</p>
                                </div>
                            </div>
                        </div>

                        {/* Visibility Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${blog.isVisible ? "bg-green-100" : "bg-gray-100"
                                        }`}
                                >
                                    {blog.isVisible ? (
                                        <Eye className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Visibility
                                    </label>
                                    <p
                                        className={`text-lg font-bold ${blog.isVisible ? "text-green-600" : "text-gray-600"
                                            }`}
                                    >
                                        {blog.isVisible ? "Visible" : "Hidden"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Content
                        </label>
                        <div
                            className="text-base text-foreground mt-3 leading-relaxed prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.details }}
                        />
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Created Date */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-main-color" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Created Date
                                    </label>
                                    <p className="text-base font-medium text-foreground">
                                        {dayjs(blog.createdAt).format("DD MMM, YYYY")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-main-color" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </label>
                                    <p className="text-base font-medium text-foreground">
                                        {dayjs(blog.updatedAt).format("DD MMM, YYYY")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Status
                        </label>
                        <div className="mt-3">
                            <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${blog.isDeleted
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full mr-2 ${blog.isDeleted ? "bg-red-500" : "bg-green-500"
                                        }`}
                                />
                                {blog.isDeleted ? "Deleted" : "Active"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
