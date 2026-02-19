"use client";
import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import HeroSectionForm from "./_components/HeroSectionForm";
import HeroButtonsForm from "./_components/HeroButtonsForm";
import CommonSectionForm from "./_components/CommonSectionForm";

const items: TabsProps["items"] = [
    {
        key: "1",
        label: "Hero Section",
        children: <HeroSectionForm />,
    },
    {
        key: "2",
        label: "Hero Buttons",
        children: <HeroButtonsForm />,
    },
    {
        key: "3",
        label: "Service Section",
        children: <CommonSectionForm sectionName="Service Section" />,
    },
    {
        key: "4",
        label: "Blog Section",
        children: <CommonSectionForm sectionName="Blog Section" />,
    },
    {
        key: "5",
        label: "Resource Section",
        children: <CommonSectionForm sectionName="Resource Section" />,
    },
    {
        key: "6",
        label: "Learn & Grow Section",
        children: <CommonSectionForm sectionName="Learn & Grow Section" />,
    },
    {
        key: "7",
        label: "Testimonial Section",
        children: <CommonSectionForm sectionName="Testimonial Section" />,
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
