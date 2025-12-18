import { Button } from 'antd'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import BlogManagementContainer from './BlogManagementContainer'

export default function Blog() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">
            <div className="flex-between mb-2">
                <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
                    Blog  List
                </h1>
                <Link href={"/blog-management/add-blog"}>
                    <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Blog</Button>
                </Link>
            </div>
            <BlogManagementContainer />
        </div>
    )
}
