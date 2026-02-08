"use client";

import TestimonialCard from "./TestimonialCard";
import { useGetTestimonialsQuery } from "@/redux/api/testimonialsApi";
import { Spin } from "antd";
import { ITestimonial } from "@/types/testimonial.types";

export default function TestimonialManagementContainer() {
    const { data: testimonialsData, isLoading, isError } = useGetTestimonialsQuery();

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
                Failed to load testimonials. Please try again.
            </div>
        );
    }

    const testimonials = testimonialsData?.data?.data || [];

    if (testimonials.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
                No testimonials found. Add your first testimonial!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((review: ITestimonial) => (
                <div key={review.id}>
                    <TestimonialCard review={review} />
                </div>
            ))}
        </div>
    );
}
