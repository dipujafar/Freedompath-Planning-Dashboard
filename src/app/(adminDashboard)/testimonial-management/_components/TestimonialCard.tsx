"use client";

import { Star, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ITestimonial } from "@/types/testimonial.types";
import { Modal } from "antd";
import { useDeleteTestimonialMutation } from "@/redux/api/testimonialsApi";
import { toast } from "sonner";

export default function TestimonialCard({ review }: { review: ITestimonial }) {
    const router = useRouter();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
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
                <div className="flex gap-x-1">
                    {Array.from({ length: fullStars }, (_, index) => (
                        <Star key={index} size={18} fill="#2563EB" className="text-[#2563EB]" />
                    ))}
                    {review.rating % 1 !== 0 && (
                        <Star size={18} fill="#2563EB" className="text-[#2563EB] opacity-50" />
                    )}
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
                        <Eye
                            size={20}
                            color="#78C0A8"
                            onClick={() => router.push(`/testimonial-management/${review.id}`)}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                        />
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

