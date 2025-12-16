import { Star } from "lucide-react";
import Image, { StaticImageData } from "next/image";

type TReview = {
    id: number;
    name: string;
    comment: string;
    image: StaticImageData;
    org: string;
    rating: number
}

export default function TestimonialCard({ review }: { review: TReview }) {
    return (
        <div className=" flex flex-col md:flex-row lg:gap-8 gap-3 w-full">
            <div className="md:w-1/3" >
                <Image src={review?.image} alt="review_client_image" className="object-cover md:w-[239px] h-[239px] rounded-2xl" />
            </div>
            <div className="md:w-2/3 py-3 flex flex-col justify-between gap-2">
                <div className="flex gap-x-1">
                    {
                        Array.from({ length: review?.rating }, (_, index) => (
                            <Star key={index} size={18} fill="#2563EB" className="text-[#2563EB]" />
                        ))
                    }
                </div>
                <p className="text-lg font-medium"><span>“</span>{review?.comment}  <span>”</span> </p>
                <div className="flex items-center gap-x-2.5">
                    <p className="text-[#090914] font-semibold">{review?.name}</p>
                    <p className="text-[#64748B] font-medium">{review?.org}</p>
                </div>
            </div>
        </div>
    )
}
