import { Button } from 'antd'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import BookManagementTable from './_components/BookManagementTable'

export default function BookManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">
            <div className="flex-between mb-2">
                <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
                   Book List
                </h1>
                <Link href={"/book-management/add-book"}>
                    <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add New Book</Button>
                </Link>
            </div>
            <BookManagementTable />
        </div>
    )
}
