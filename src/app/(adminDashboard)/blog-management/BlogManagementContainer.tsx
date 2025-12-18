import { Eye, EyeOff, SquarePen, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export const blogPosts = [
    {
        id: 1,
        title: "Most popular design systems to learn from in 2022",
        tag: "Design Systems",
        image: "/blog_image_1.png",
    },
    {
        id: 2,
        title: "Understanding accessibility makes you a better",
        tag: "Accessibility",
        image: "/blog_image_2.png",
    },
    {
        id: 3,
        title: "15 best tools that will help you build your website",
        tag: "Tech",
        image: "/blog_image_3.png",
    },
    {
        id: 4,
        title: "Understanding accessibility makes you a better",
        tag: "Tech",
        image: "/blog_image_2.png",
    },
    {
        id: 5,
        title: "How to build scalable design systems",
        tag: "Design Systems",
        image: "/blog_image_1.png",
    },
    {
        id: 6,
        title: "Top accessibility mistakes beginners make",
        tag: "Accessibility",
        image: "/blog_image_2.png",
    },
    {
        id: 7,
        title: "Best 10 frameworks to learn in 2024",
        tag: "Tech",
        image: "/blog_image_3.png",
    },
    {
        id: 8,
        title: "Improving UI consistency with token systems",
        tag: "Design Systems",
        image: "/blog_image_1.png",
    },
    {
        id: 9,
        title: "Why inclusive design matters",
        tag: "Accessibility",
        image: "/blog_image_2.png",
    },
    {
        id: 10,
        title: "Top VS Code extensions for productivity",
        tag: "Tech",
        image: "/blog_image_3.png",
    },
    {
        id: 11,
        title: "Building color palettes for design systems",
        tag: "Design Systems",
        image: "/blog_image_1.png",
    },
    {
        id: 12,
        title: "Keyboard navigation: what devs should know",
        tag: "Accessibility",
        image: "/blog_image_2.png",
    }
];

export default function BlogManagementContainer() {
    return (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-1 xl:gap-9 md:gap-5 gap-3">
            {
                blogPosts?.map((service, index) => (
                    <div key={service?.id} className='relative'>

                        <div key={service?.id} className="lg:space-y-6 md:space-y-4 space-y-2.5 group cursor-pointer ">
                            <Image src={service?.image} alt="service-image" width={300} height={300} className="w-full rounded-2xl" />
                            <div className="lg:space-y-1.5 space-y-1">
                                <h1 className="xl:text-xl md:text-lg font-semibold xl:leading-7 leading-6">{service?.title}</h1>
                                <p className="text-main-color font-medium">{service?.tag}</p>
                            </div>
                        </div>
                        <div className='absolute top-2 right-2 flex gap-x-2.5 z-20'>
                            <div className='size-8 bg-green-500 flex-center text-white rounded-full cursor-pointer'>
                                <SquarePen size={20} />
                            </div>
                            <div className='size-8 bg-red-500 flex-center text-white rounded-full cursor-pointer'>
                                <Trash2 size={20} />
                            </div>
                            <div className='size-8 bg-black flex-center text-white rounded-full cursor-pointer'>
                                {index  === 2 ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        {index  === 2 && <div className='absolute inset-0 bg-black/20 rounded-2xl z-10'/>}

                        
                    </div>
                ))
            }
        </div>
    )
}
