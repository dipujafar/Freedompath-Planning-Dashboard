"use client"
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddToolResources from './AddToolResources';
import { Tabs } from 'antd';
import AddEBookResource from './AddEBookResource';


const items = [
    {
        key: '1',
        label: 'Tool resources',
        children: <AddToolResources />,
    },
    {
        key: '2',
        label: 'Book Resources',
        children: <AddEBookResource />,
    }
];


export default function AddResourceContainer() {
    const router = useRouter();
    return (
        <div className='min-h-screen bg-background p-4'>
            <div className="mb-6 flex items-center gap-3">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Add Resources</h1>
            </div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}
