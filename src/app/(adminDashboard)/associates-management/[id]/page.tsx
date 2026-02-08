"use client";

import { useGetSingleAssociateQuery } from "@/redux/api/associatesApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Spin } from "antd";
import Image from "next/image";
import dayjs from "dayjs";

const AssociateDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const associateId = params.id as string;

    const {
        data: associateData,
        isLoading,
        isError,
    } = useGetSingleAssociateQuery(associateId, {
        skip: !associateId,
    });

    const associate = associateData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !associate) {
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
                    <h1 className="text-xl font-semibold">Associate Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load associate details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The associate may not exist or there was an error loading the data.
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
                    <h1 className="text-xl font-semibold">Associate Details</h1>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Associate Photo */}
                    <div className="lg:col-span-1">
                        <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border-color bg-section-bg shadow-sm">
                            <Image
                                src={associate.photo || "/user_image.png"}
                                alt={associate.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/user_image.png";
                                }}
                            />
                        </div>
                    </div>

                    {/* Associate Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <User className="h-5 w-5 text-main-color" />
                                </div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Name
                                </label>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mt-2">
                                {associate.name}
                            </h2>
                        </div>

                        {/* Bio Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Biography
                            </label>
                            <p className="text-base text-foreground mt-3 leading-relaxed">
                                {associate.bio}
                            </p>
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
                                            {dayjs(associate.createdAt).format("DD MMM, YYYY")}
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
                                            {dayjs(associate.updatedAt).format("DD MMM, YYYY")}
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
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${associate.isDeleted
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${associate.isDeleted ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    />
                                    {associate.isDeleted ? "Deleted" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssociateDetailPage;
