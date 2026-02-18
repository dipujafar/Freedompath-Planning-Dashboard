"use client";
import React from "react";
import ServiceManagementTable from "./_components/ServiceManagementTable";
import Link from "next/link";
import { Button, Tabs } from "antd";
import type { TabsProps } from "antd";
import { PlusIcon } from "lucide-react";
import ServicePageSettingsForm from "./_components/ServicePageSettingsForm";
import ServiceDetailsSettingsForm from "./_components/ServiceDetailsSettingsForm";

export default function ServiceManagementPage() {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Service List",
            children: (
                <div>
                    <div className="flex-between mb-4">
                        <h2 className="text-lg font-medium text-gray-700">All Services</h2>
                        <Link href={"/service-management/add-service"}>
                            <Button icon={<PlusIcon size={20} />} className="!h-[40px] hover:!bg-black">Add Service</Button>
                        </Link>
                    </div>
                    <ServiceManagementTable />
                </div>
            ),
        },
        {
            key: "2",
            label: "Service Page Settings",
            children: <ServicePageSettingsForm />,
        },
        {
            key: "3",
            label: "Service Details Page: Included Section",
            children: <ServiceDetailsSettingsForm sectionName="What's Included Section" />,
        },
    ];

    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-6">
            <h1 className="text-[#000000] text-xl font-medium mb-6">
                Service Management
            </h1>
            <Tabs defaultActiveKey="1" items={items} size="large" className="custom-tabs" />
        </div>
    );
}
