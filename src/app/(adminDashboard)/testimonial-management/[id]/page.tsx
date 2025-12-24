"use client";

import { useGetSingleTestimonialQuery } from "@/redux/api/testimonialsApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Star, Briefcase } from "lucide-react";
import { Spin } from "antd";
import Image from "next/image";
import dayjs from "dayjs";

const TestimonialDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const testimonialId = params.id as string;

    const {
        data: testimonialData,
        isLoading,
        isError,
    } = useGetSingleTestimonialQuery(testimonialId, {
        skip: !testimonialId,
    });

    const testimonial = testimonialData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !testimonial) {
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
                    <h1 className="text-xl font-semibold">Testimonial Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load testimonial details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The testimonial may not exist or there was an error loading the data.
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

    const fullStars = Math.floor(testimonial.rating);

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
                    <h1 className="text-xl font-semibold">Testimonial Details</h1>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Client Photo */}
                    <div className="lg:col-span-1">
                        <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border-color bg-section-bg shadow-sm">
                            <Image
                                src={testimonial.clientPhoto || "/user_image.png"}
                                alt={testimonial.clientName}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/user_image.png";
                                }}
                            />
                        </div>
                    </div>

                    {/* Testimonial Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Name Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <User className="h-5 w-5 text-main-color" />
                                </div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Client Name
                                </label>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mt-2">
                                {testimonial.clientName}
                            </h2>
                        </div>

                        {/* Designation Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-main-color" />
                                </div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Designation
                                </label>
                            </div>
                            <p className="text-lg font-medium text-foreground mt-2">
                                {testimonial.designation}
                            </p>
                        </div>

                        {/* Rating Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Rating
                            </label>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex gap-1">
                                    {Array.from({ length: fullStars }, (_, index) => (
                                        <Star key={index} size={24} fill="#2563EB" className="text-[#2563EB]" />
                                    ))}
                                    {testimonial.rating % 1 !== 0 && (
                                        <Star size={24} fill="#2563EB" className="text-[#2563EB] opacity-50" />
                                    )}
                                </div>
                                <span className="text-xl font-semibold text-foreground ml-2">
                                    {testimonial.rating}
                                </span>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Testimonial
                            </label>
                            <p className="text-base text-foreground mt-3 leading-relaxed italic">
                                "{testimonial.description}"
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
                                            {dayjs(testimonial.createdAt).format("DD MMM, YYYY")}
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
                                            {dayjs(testimonial.updatedAt).format("DD MMM, YYYY")}
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
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${testimonial.isDeleted
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${testimonial.isDeleted ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    />
                                    {testimonial.isDeleted ? "Deleted" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialDetailPage;
