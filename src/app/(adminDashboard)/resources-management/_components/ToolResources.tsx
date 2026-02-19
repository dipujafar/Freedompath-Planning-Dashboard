"use client";

import { TableProps, Spin, Modal } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye, EyeOff, Pencil, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import resourceImage from "@/assets/image/resources_image.png";
import Image from "next/image";
import Link from "next/link";
import {
    useGetToolResourcesQuery,
    useGetSingleToolResourceQuery,
    useUpdateToolResourceMutation,
} from "@/redux/api/toolResourcesApi";
import { IToolResource } from "@/types/resource.types";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";

type TDataType = {
    key: string;
    id: string;
    serial: number;
    name: string;
    details: string;
    link: string;
    isVisible: boolean;
    createdAt: string;
};

// ─── Detail Modal ────────────────────────────────────────────────────────────

function ToolDetailModal({ id, open, onClose }: { id: string | null; open: boolean; onClose: () => void }) {
    const { data, isLoading } = useGetSingleToolResourceQuery(id!, { skip: !id });
    const resource = data?.data;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">Tool Resource Details</span>
                    {resource && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${resource.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {resource.isVisible ? "Visible" : "Hidden"}
                        </span>
                    )}
                </div>
            }
            width={560}
            centered
        >
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Spin size="large" />
                </div>
            ) : resource ? (
                <div className="space-y-4 pt-2">
                    {/* Name */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tool Name</p>
                        <p className="text-sm font-semibold text-gray-800">{resource.name}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Details</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{resource.details}</p>
                    </div>

                    {/* Link */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Resource Link</p>
                        <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                        >
                            {resource.link}
                            <ExternalLink size={13} />
                        </a>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created</p>
                            <p className="text-sm text-gray-700">{dayjs(resource.createdAt).format("DD MMM, YYYY")}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last Updated</p>
                            <p className="text-sm text-gray-700">{dayjs(resource.updatedAt).format("DD MMM, YYYY")}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-8">Resource not found.</p>
            )}
        </Modal>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ToolResources = () => {
    const router = useRouter();
    const { data: toolResourcesData, isLoading, isError } = useGetToolResourcesQuery();
    const [updateToolResource] = useUpdateToolResourceMutation();

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [viewId, setViewId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const tableData: TDataType[] =
        toolResourcesData?.data?.data?.map((resource: IToolResource, index: number) => ({
            key: resource.id,
            id: resource.id,
            serial: index + 1,
            name: resource.name,
            details: resource.details,
            link: resource.link,
            isVisible: resource.isVisible ?? true,
            createdAt: dayjs(resource.createdAt).format("DD MMM, YYYY"),
        })) || [];

    const handleToggleVisibility = async (record: TDataType) => {
        setTogglingId(record.id);
        try {
            await updateToolResource({
                id: record.id,
                body: { isVisible: !record.isVisible },
            }).unwrap();
            toast.success(`Resource marked as ${!record.isVisible ? "visible" : "hidden"}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update visibility");
        } finally {
            setTogglingId(null);
        }
    };

    const handleView = (id: string) => {
        setViewId(id);
        setModalOpen(true);
    };

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "#",
            dataIndex: "serial",
            width: 50,
            render: (val: number) => <p className="text-gray-500 text-sm">{val}</p>,
        },
        {
            title: "Tool Name",
            dataIndex: "name",
            render: (text: string, record) => (
                <div className="flex items-center gap-2">
                    <p className="font-medium">{text}</p>
                    {!record.isVisible && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Hidden</span>
                    )}
                </div>
            ),
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (text: string) => (
                <p className="max-w-[300px] truncate text-sm text-gray-600" title={text}>
                    {text}
                </p>
            ),
        },
        {
            title: "Listing Date",
            dataIndex: "createdAt",
            render: (text: string) => <span className="text-sm text-gray-600">{text}</span>,
        },
        {
            title: "Resource Link",
            dataIndex: "link",
            align: "center",
            render: (_, record) => (
                <Link href={record.link} target="_blank" className="flex-center cursor-pointer">
                    <Image src={resourceImage} alt="resource link" width={25} height={25} className="object-cover rounded-2xl" />
                </Link>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (_, record) => (
                <div className="flex items-center justify-center gap-3">
                    {/* View Details */}
                    <button
                        onClick={() => handleView(record.id)}
                        title="View details"
                        className="text-xs font-medium px-2.5 py-1 rounded border border-[#78C0A8] text-[#78C0A8] hover:bg-[#78C0A8] hover:text-white transition-colors"
                    >
                        View
                    </button>

                    {/* Visibility Toggle */}
                    <button
                        onClick={() => handleToggleVisibility(record)}
                        disabled={togglingId === record.id}
                        title={record.isVisible ? "Click to hide" : "Click to show"}
                        className="transition-opacity hover:opacity-70 disabled:opacity-40"
                    >
                        {togglingId === record.id ? (
                            <span className="inline-block h-[20px] w-[20px] rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                        ) : record.isVisible ? (
                            <EyeOff size={20} color="#F59E0B" />
                        ) : (
                            <Eye size={20} color="#9CA3AF" />
                        )}
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => router.push(`/resources-management/edit-tool/${record.id}`)}
                        title="Edit resource"
                        className="text-[#4378A8] hover:opacity-70 transition-opacity"
                    >
                        <Pencil size={20} />
                    </button>
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

    return (
        <>
            <DataTable columns={columns} data={tableData} pageSize={10} />
            <ToolDetailModal
                id={viewId}
                open={modalOpen}
                onClose={() => { setModalOpen(false); setViewId(null); }}
            />
        </>
    );
};

export default ToolResources;
