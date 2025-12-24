"use client";
import { Image as AntImage, TableProps, Spin } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAssociatesQuery } from "@/redux/api/associatesApi";
import { IAssociate } from "@/types/associate.types";
import dayjs from "dayjs";

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
                <p className="max-w-[500px] truncate" title={text}>
                    {text}
                </p>
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
                <Eye
                    size={22}
                    color="#78C0A8"
                    onClick={() => router.push(`/associates-management/${record.id}`)}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                />
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