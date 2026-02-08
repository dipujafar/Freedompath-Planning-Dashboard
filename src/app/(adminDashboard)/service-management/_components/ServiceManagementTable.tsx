"use client";
import { Image, Table, Tag, Typography, Space, Tooltip, Avatar, Badge, Modal, message } from "antd";
import { Eye, Edit, ChevronDown, CheckCircle2, Clock, ShieldCheck, Zap, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetServicesQuery, useDeleteServiceMutation } from "@/redux/api/servicesApi";
import { IService, IServiceOption } from "@/types/service.types";
import dayjs from "dayjs";
import { useState } from "react";

const { Text, Title } = Typography;

const ServiceManagementTable = () => {
    const router = useRouter();
    const { data: servicesData, isLoading, isFetching } = useGetServicesQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<IService | null>(null);

    // Open delete confirmation modal
    const openDeleteModal = (service: IService) => {
        setServiceToDelete(service);
        setDeleteModalOpen(true);
    };

    // Delete handler
    const handleDelete = async () => {
        if (!serviceToDelete) return;
        try {
            await deleteService(serviceToDelete.id).unwrap();
            message.success("Service deleted successfully");
            setDeleteModalOpen(false);
            setServiceToDelete(null);
        } catch (error) {
            message.error("Failed to delete service");
        }
    };

    // Icon helper for the features
    const getFeatureIcon = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes('support')) return <Clock size={16} className="text-blue-500" />;
        if (lower.includes('secure')) return <ShieldCheck size={16} className="text-emerald-500" />;
        if (lower.includes('fast') || lower.includes('delivery')) return <Zap size={16} className="text-amber-500" />;
        return <CheckCircle2 size={16} className="text-primary" />;
    };

    const columns = [
        {
            title: "Service Info",
            dataIndex: "serviceName",
            key: "serviceName",
            width: 350,
            render: (_: any, record: IService) => (
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <Image
                            src={record.image}
                            alt={record.serviceName}
                            width={64}
                            height={64}
                            className="object-cover rounded-lg shadow-sm border border-gray-100"
                        />
                    </div>
                    <div>
                        <Text strong className="text-base block mb-1">{record.serviceName}</Text>
                        <Text type="secondary" className="text-xs line-clamp-2" title={record.subTitle}>
                            {record.subTitle}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Features",
            key: "features",
            render: (_: any, record: IService) => {
                const featureCount = record.whatYourClientGets?.options?.length || 0;
                return (
                    <Badge count={featureCount} showZero color={featureCount > 0 ? "blue" : "gray"} overflowCount={99}>
                        <div className="bg-slate-50 px-3 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600">
                            Included Items
                        </div>
                    </Badge>
                );
            }
        },
        {
            title: "Status",
            dataIndex: "isDeleted",
            key: "isDeleted",
            render: (isDeleted: boolean) => (
                <Tag color={isDeleted ? "error" : "success"} className="px-2 py-1 rounded-full border-0 font-medium">
                    {isDeleted ? "Inactive" : "Active"}
                </Tag>
            ),
        },
        {
            title: "Last Updated",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date: string) => (
                <div className="flex flex-col">
                    <Text className="text-sm">{dayjs(date).format("MMM D, YYYY")}</Text>
                    <Text type="secondary" className="text-xs">{dayjs(date).format("h:mm A")}</Text>
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            align: 'center' as const,
            render: (_: any, record: IService) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <div
                            className="cursor-pointer bg-emerald-50 p-2 rounded-full hover:bg-emerald-100 transition-colors"
                            onClick={() => router.push(`/service-management/${record.id}`)}
                        >
                            <Eye size={18} className="text-emerald-600" />
                        </div>
                    </Tooltip>
                    <Tooltip title="Edit Service">
                        <div
                            className="cursor-pointer bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors"
                            onClick={() => router.push(`/service-management/edit/${record.id}`)}
                        >
                            <Edit size={18} className="text-blue-600" />
                        </div>
                    </Tooltip>
                    <Tooltip title="Delete Service">
                        <div
                            className="cursor-pointer bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                            onClick={() => openDeleteModal(record)}
                        >
                            <Trash2 size={18} className="text-red-600" />
                        </div>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record: IService) => {
        const options = record.whatYourClientGets?.options || [];
        const heroImage = record.whatYourClientGets?.image;

        return (
            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 m-2">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Included Features List */}
                    <div className="flex-1">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">What Your Client Gets</h4>
                            <p className="text-xs text-slate-500">Detailed breakdown of the service package</p>
                        </div>

                        {options.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {options.map((option: IServiceOption) => (
                                    <div key={option.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mt-0.5 bg-slate-50 p-1.5 rounded-md">
                                            {getFeatureIcon(option.title)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 leading-tight">{option.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{option.subTitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-400 italic text-sm py-4">No specific features listed for this service.</div>
                        )}
                    </div>

                    {/* Right: Feature Image/Preview if available */}
                    {heroImage && (
                        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">Service Asset</span>
                            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white p-1">
                                <Image
                                    src={heroImage}
                                    alt="Feature Detail"
                                    className="!w-full !h-32 object-cover rounded"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table
                loading={isLoading || isFetching}
                columns={columns}
                dataSource={servicesData?.data?.data || []}
                rowKey="id"
                expandable={{
                    expandedRowRender,
                    expandRowByClick: false,
                    expandIcon: ({ expanded, onExpand, record }) => (
                        <ChevronDown
                            size={20}
                            className={`text-slate-400 transition-transform duration-300 cursor-pointer ${expanded ? 'rotate-180' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onExpand(record, e as any);
                            }}
                        />
                    ),
                    columnWidth: 48
                }}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} services`,
                    className: "px-6 pb-4"
                }}
                className="custom-table"
            />

            {/* Professional Delete Confirmation Modal */}
            <Modal
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setServiceToDelete(null);
                }}
                footer={null}
                centered
                closable={false}
                width={420}
                styles={{
                    mask: {
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(0, 0, 0, 0.45)',
                    },
                }}
                className="delete-confirmation-modal"
            >
                <div className="flex flex-col items-center text-center py-4">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        Delete Service
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 mb-2">
                        You are about to delete
                    </p>
                    <p className="text-slate-800 font-medium mb-4 px-4">
                        "{serviceToDelete?.serviceName}"
                    </p>
                    <p className="text-slate-400 text-sm mb-6">
                        This action cannot be undone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setServiceToDelete(null);
                            }}
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Delete Service
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ServiceManagementTable;
