"use client";
import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import HeroSectionForm from "./_components/HeroSectionForm";

const items: TabsProps["items"] = [
    {
        key: "1",
        label: "Hero Section",
        children: <HeroSectionForm />,
    },
    {
        key: "2",
        label: "Service Section",
        children: <div className="p-4 text-center text-gray-500">Service Section Content (Coming Soon)</div>,
    },
    {
        key: "3",
        label: "Blog Section",
        children: <div className="p-4 text-center text-gray-500">Blog Section Content (Coming Soon)</div>,
    },
    {
        key: "4",
        label: "Resource Section",
        children: <div className="p-4 text-center text-gray-500">Resource Section Content (Coming Soon)</div>,
    },
    {
        key: "5",
        label: "Learn & Grow Section",
        children: <div className="p-4 text-center text-gray-500">Learn & Grow Section Content (Coming Soon)</div>,
    },
    {
        key: "6",
        label: "Testimonial Section",
        children: <div className="p-4 text-center text-gray-500">Testimonial Section Content (Coming Soon)</div>,
    },
];

export default function HomepageManagementPage() {
    const onChange = (key: string) => {
        // track tab change if needed
    };

    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-6">
            <h1 className="text-[#000000] text-2xl font-semibold mb-6">
                Homepage Management
            </h1>
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
                size="large"
                className="custom-tabs"
            />
        </div>
    );
}
