"use client";
import { Button, Tabs } from 'antd'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import ToolResources from './_components/ToolResources';
import EbookResources from './_components/EbookResources';
import PageSettingsForm from './_components/PageSettingsForm';


const items = [
    {
        key: '1',
        label: 'Resources Page Settings',
        children: <PageSettingsForm pageName="Resources Page" />,
    },
    {
        key: '2',
        label: 'Tool resources List',
        children: (
            <div>
                <div className="flex-between mb-4">
                    <h2 className="text-lg font-medium text-gray-700">All Tool Resources</h2>
                    <Link href={"/resources-management/add-resource/tool"}>
                        <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Tool</Button>
                    </Link>
                </div>
                <ToolResources />
            </div>
        ),
    },
    {
        key: '3',
        label: 'Book Resources List',
        children: (
            <div>
                <div className="flex-between mb-4">
                    <h2 className="text-lg font-medium text-gray-700">All Book Resources</h2>
                    <Link href={"/resources-management/add-resource/book"}>
                        <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Book</Button>
                    </Link>
                </div>
                <EbookResources />
            </div>
        ),
    }
];



export default function ResourcesManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">
            <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
                Resources Management
            </h1>
            <Tabs defaultActiveKey="1" items={items} size="large" className="custom-tabs" />
        </div>
    )
}
