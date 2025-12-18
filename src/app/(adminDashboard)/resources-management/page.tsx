import { Button, Tabs } from 'antd'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import ToolResources from './_components/ToolResources';
import EbookResources from './_components/EbookResources';


const items = [
    {
        key: '1',
        label: 'Tool resources',
        children: <ToolResources />,
    },
    {
        key: '2',
        label: 'E-Book Resources',
        children: <EbookResources />,
    }
];



export default function ResourcesManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">
            <div className="flex-between mb-2">
                <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
                    Resources List
                </h1>
                <Link href={"/resources-management/add-resource"}>
                    <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Resource</Button>
                </Link>
            </div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}
