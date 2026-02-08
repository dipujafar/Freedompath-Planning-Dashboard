"use client";

import { TableProps, Spin } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import resourceImage from "@/assets/image/resources_image.png";
import Image from "next/image";
import Link from "next/link";
import { useGetToolResourcesQuery } from "@/redux/api/toolResourcesApi";
import { IToolResource } from "@/types/resource.types";
import dayjs from "dayjs";

type TDataType = {
    key: string;
    id: string;
    serial: number;
    name: string;
    details: string;
    link: string;
    createdAt: string;
};

const ToolResources = () => {
    const router = useRouter();
    const { data: toolResourcesData, isLoading, isError } = useGetToolResourcesQuery();

    // Transform API data to table format
    const tableData: TDataType[] =
        toolResourcesData?.data?.data?.map((resource: IToolResource, index: number) => ({
            key: resource.id,
            id: resource.id,
            serial: index + 1,
            name: resource.name,
            details: resource.details,
            link: resource.link,
            createdAt: dayjs(resource.createdAt).format("DD MMM, YYYY"),
        })) || [];

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Tool Name",
            dataIndex: "name",
            render: (text: string) => <p className="font-medium">{text}</p>,
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (text: string) => (
                <p className="max-w-[400px] truncate" title={text}>
                    {text}
                </p>
            ),
        },
        {
            title: "Listing Date",
            dataIndex: "createdAt",
        },
        {
            title: "Resource Link",
            dataIndex: "link",
            align: "center",
            render: (_, record) => (
                <Link
                    href={record.link}
                    target="_blank"
                    className="flex-center cursor-pointer"
                >
                    <Image
                        src={resourceImage}
                        alt="resource link"
                        width={25}
                        height={25}
                        className="object-cover rounded-2xl"
                    />
                </Link>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Eye
                        size={22}
                        color="#78C0A8"
                        onClick={() => router.push(`/resources-management/tool/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                    <Pencil
                        size={20}
                        color="#4378A8"
                        onClick={() => router.push(`/resources-management/edit-tool/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500">
                Failed to load tool resources. Please try again.
            </div>
        );
    }

    return <DataTable columns={columns} data={tableData} pageSize={10} />;
};

export default ToolResources;
