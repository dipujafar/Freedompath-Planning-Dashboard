"use client";

import { useParams } from "next/navigation";
import { useGetSingleTestimonialQuery } from "@/redux/api/testimonialsApi";
import { TestimonialForm } from "../../_components/TestimonialForm";
import { Spin } from "antd";

const EditTestimonialPage = () => {
    const params = useParams();
    const testimonialId = params.id as string;

    const { data: testimonialData, isLoading, isError } =
        useGetSingleTestimonialQuery(testimonialId, {
            skip: !testimonialId,
        });

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !testimonialData?.data) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load testimonial</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The testimonial may not exist or there was an error loading the data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <TestimonialForm
            mode="edit"
            testimonialId={testimonialId}
            initialData={testimonialData.data}
        />
    );
};

export default EditTestimonialPage;
