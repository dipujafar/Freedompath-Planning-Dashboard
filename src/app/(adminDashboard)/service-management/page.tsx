import React from 'react'
import ServiceManagementTable from './_components/ServiceManagementTable'
import Link from 'next/link'
import { Button } from 'antd'
import { PlusIcon } from 'lucide-react'

export default function ServiceManagementPage() {
    return (
        <div className="bg-section-bg rounded-xl border border-border-color p-4">
            <div className="flex-between mb-2">
                <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
                    Service List
                </h1>
                <Link href={"/service-management/add-service"}>
                    <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Service</Button>
                </Link>
            </div>
            <ServiceManagementTable />
        </div>
    )
}
