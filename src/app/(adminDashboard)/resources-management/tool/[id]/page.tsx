"use client";

import { useGetSingleToolResourceQuery } from "@/redux/api/toolResourcesApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Link as LinkIcon, FileText } from "lucide-react";
import { Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

const ToolResourceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const resourceId = params.id as string;

    const {
        data: resourceData,
        isLoading,
        isError,
    } = useGetSingleToolResourceQuery(resourceId, {
        skip: !resourceId,
    });

    const resource = resourceData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !resource) {
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
                    <h1 className="text-xl font-semibold">Tool Resource Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load tool resource details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The resource may not exist or there was an error loading the data.
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
                    <h1 className="text-xl font-semibold">Tool Resource Details</h1>
                </div>

                {/* Content */}
                <div className="space-y-6 max-w-4xl">
                    {/* Name Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-main-color/10 rounded-lg">
                                <FileText className="h-5 w-5 text-main-color" />
                            </div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Tool Name
                            </label>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mt-2">
                            {resource.name}
                        </h2>
                    </div>

                    {/* Details Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Details
                        </label>
                        <p className="text-base text-foreground mt-3 leading-relaxed">
                            {resource.details}
                        </p>
                    </div>

                    {/* Resource Link Card */}
                    <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-main-color/10 rounded-lg">
                                <LinkIcon className="h-5 w-5 text-main-color" />
                            </div>
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Resource Link
                            </label>
                        </div>
                        <Link
                            href={resource.link}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800 underline mt-2 block"
                        >
                            {resource.link}
                        </Link>
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
                                        {dayjs(resource.createdAt).format("DD MMM, YYYY")}
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
                                        {dayjs(resource.updatedAt).format("DD MMM, YYYY")}
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
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${resource.isDeleted
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full mr-2 ${resource.isDeleted ? "bg-red-500" : "bg-green-500"
                                        }`}
                                />
                                {resource.isDeleted ? "Deleted" : "Active"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolResourceDetailPage;
