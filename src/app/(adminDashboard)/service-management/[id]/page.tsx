"use client";

import { useGetSingleServiceQuery } from "@/redux/api/servicesApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Zap } from "lucide-react";
import { Spin } from "antd";

import dayjs from "dayjs";

const ServiceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    const {
        data: serviceData,
        isLoading,
        isError,
    } = useGetSingleServiceQuery(serviceId, {
        skip: !serviceId,
    });

    const service = serviceData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !service) {
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
                    <h1 className="text-xl font-semibold">Service Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load service details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The service may not exist or there was an error loading the data.
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
                    <h1 className="text-xl font-semibold">Service Details</h1>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service Image */}
                    <div className="lg:col-span-1">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border-color bg-section-bg">
                            <img
                                src={service.image || "/service_image.jpg"}
                                alt={service.serviceName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/service_image.jpg";
                                }}
                            />
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Name */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Service Name
                            </label>
                            <h2 className="text-2xl font-semibold text-foreground mt-2">
                                {service.serviceName}
                            </h2>
                        </div>



                        {/* Subtitle */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Subtitle
                            </label>
                            <p className="text-base text-foreground mt-2 leading-relaxed">
                                {service.subTitle}
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
                                            {dayjs(service.createdAt).format("DD MMM, YYYY")}
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
                                            {dayjs(service.updatedAt).format("DD MMM, YYYY")}
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
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${service.isDeleted
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${service.isDeleted ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    />
                                    {service.isDeleted ? "Deleted" : "Active"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* What Your Client Gets Section */}
                {service.whatYourClientGets && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold">What Your Client Gets</h2>
                        </div>
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Image */}
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border-color bg-white">
                                    <img
                                        src={service.whatYourClientGets.image || "/service_image.jpg"}
                                        alt="Client Benefits"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "/service_image.jpg";
                                        }}
                                    />
                                </div>

                                {/* Options List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-foreground mb-4">Benefits & Features</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {service.whatYourClientGets.options.map((option: any) => (
                                            <div key={option.id} className="flex gap-4 p-4 bg-white rounded-xl border border-border-color shadow-sm">
                                                <div className="shrink-0 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{option.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">{option.subTitle}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Included Services Section */}
                {service.includedServices && service.includedServices.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold">Included Services</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {service.includedServices.map((included: any) => (
                                <div key={included.id} className="bg-section-bg p-6 rounded-2xl border border-border-color hover:border-main-color transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4 group-hover:bg-main-color group-hover:text-white transition-colors">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground mb-2">{included.title}</h3>
                                    <p className="text-sm text-muted-foreground">{included.subTitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetailPage;
