"use client";

import { Star, Eye, Pencil, Trash2, EyeOff, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ITestimonial } from "@/types/testimonial.types";
import { Modal, Button } from "antd";
import { useDeleteTestimonialMutation, useUpdateTestimonialStatusMutation } from "@/redux/api/testimonialsApi";
import { toast } from "sonner";

export default function TestimonialCard({ review }: { review: ITestimonial }) {
    const router = useRouter();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
    const [updateStatus] = useUpdateTestimonialStatusMutation();
    const fullStars = Math.floor(review.rating);

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this testimonial?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No, Cancel",
            onOk: async () => {
                try {
                    const res = await deleteTestimonial(id).unwrap();
                    if (res.success) {
                        toast.success("Testimonial deleted successfully");
                    }
                } catch (error: any) {
                    toast.error(error?.data?.message || "Failed to delete testimonial");
                }
            },
        });
    };

    const handleToggleVisibility = async () => {
        try {
            await updateStatus({
                id: review.id,
                data: { isVisible: !review.isVisible }
            }).unwrap();
            toast.success(`Testimonial is now ${!review.isVisible ? 'visible' : 'hidden'}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update visibility");
        }
    };

    return (
        <div className="flex flex-col md:flex-row lg:gap-8 gap-3 w-full bg-section-bg rounded-xl p-4 border border-border-color">
            <div className="md:w-1/3">
                <div className="relative w-full h-[200px] md:w-[180px] md:h-[180px]">
                    <Image
                        src={review.clientPhoto || "/user_image.png"}
                        alt={review.clientName}
                        fill
                        className="object-cover rounded-2xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/user_image.png";
                        }}
                    />
                </div>
            </div>
            <div className="md:w-2/3 py-3 flex flex-col justify-between gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex gap-x-1">
                        {Array.from({ length: 5 }, (_, index) => (
                            <Star
                                key={index}
                                size={18}
                                fill={index < fullStars ? "#2563EB" : "none"}
                                className={index < fullStars ? "text-[#2563EB]" : "text-gray-300"}
                            />
                        ))}
                    </div>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => router.push(`/testimonial-management/${review.id}`)}
                        className="bg-main-color hover:bg-main-color/80"
                    >
                        View Details
                    </Button>
                </div>
                <div className="text-lg font-medium line-clamp-3">
                    <span>"</span>
                    <span dangerouslySetInnerHTML={{ __html: review.description }} />
                    <span>"</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2.5">
                        <p className="text-[#090914] font-semibold">{review.clientName}</p>
                        <p className="text-[#64748B] font-medium">{review.designation}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div onClick={handleToggleVisibility} className="cursor-pointer">
                            {review.isVisible ? (
                                <Eye size={20} color="#78C0A8" />
                            ) : (
                                <EyeOff size={20} color="#94a3b8" />
                            )}
                        </div>
                        <Pencil
                            size={18}
                            color="#4378A8"
                            onClick={() => router.push(`/testimonial-management/edit/${review.id}`)}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                        />
                        <Trash2
                            size={18}
                            color="#FF4D4F"
                            onClick={() => handleDelete(review.id)}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


