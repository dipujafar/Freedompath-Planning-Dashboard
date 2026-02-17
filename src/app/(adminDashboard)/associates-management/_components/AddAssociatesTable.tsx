"use client";
import { Image as AntImage, TableProps, Spin, Modal } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAssociatesQuery, useDeleteAssociateMutation } from "@/redux/api/associatesApi";
import { IAssociate } from "@/types/associate.types";
import dayjs from "dayjs";
import { toast } from "sonner";

type TDataType = {
    key: string;
    serial: number;
    id: string;
    name: string;
    photo: string;
    bio: string;
    createdAt: string;
};

const AssociatesTable = () => {
    const router = useRouter();
    const { data: associatesData, isLoading, isError } = useGetAssociatesQuery();
    const [deleteAssociate] = useDeleteAssociateMutation();

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this associate?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No, Cancel",
            onOk: async () => {
                try {
                    const res = await deleteAssociate(id).unwrap();
                    if (res.success) {
                        toast.success("Associate deleted successfully");
                    }
                } catch (error: any) {
                    toast.error(error?.data?.message || "Failed to delete associate");
                }
            },
        });
    };

    // Transform API data to table format
    const tableData: TDataType[] =
        associatesData?.data?.data?.map((associate: IAssociate, index: number) => ({
            key: associate.id,
            serial: index + 1,
            id: associate.id,
            name: associate.name,
            photo: associate.photo,
            bio: associate.bio,
            createdAt: dayjs(associate.createdAt).format("DD MMM, YYYY"),
        })) || [];

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Image",
            dataIndex: "photo",
            align: "center",
            render: (photo: string) => (
                <div className="flex justify-center items-center gap-x-2">
                    <AntImage
                        src={photo || "/user_image.png"}
                        alt="associate"
                        width={60}
                        height={60}
                        className="object-cover rounded-2xl"
                        fallback="/user_image.png"
                    />
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text: string) => <p className="max-w-[400px] font-medium">{text}</p>,
        },
        {
            title: "Bio",
            dataIndex: "bio",
            render: (text: string) => (
                <div
                    className="max-w-[500px] truncate-3-lines"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            ),
        },
        {
            title: "Created",
            dataIndex: "createdAt",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Eye
                        size={22}
                        color="#78C0A8"
                        onClick={() => router.push(`/associates-management/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                    <Pencil
                        size={20}
                        color="#4378A8"
                        onClick={() => router.push(`/associates-management/edit/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                    <Trash2
                        size={20}
                        color="#FF4D4F"
                        onClick={() => handleDelete(record.id)}
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
                Failed to load associates. Please try again.
            </div>
        );
    }

    return <DataTable columns={columns} data={tableData} pageSize={10} />;
};

export default AssociatesTable;