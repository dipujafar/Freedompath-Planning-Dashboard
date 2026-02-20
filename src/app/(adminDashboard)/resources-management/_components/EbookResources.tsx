"use client";

import { Image as AntImage, TableProps, Spin } from "antd";
import Image from "next/image";
import DataTable from "@/utils/DataTable";
import { Eye, Pencil } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import pdf_image from "@/assets/image/pdf_image.png";
import { useGetBookResourcesQuery } from "@/redux/api/bookResourcesApi";
import { IBookResource } from "@/types/resource.types";
import dayjs from "dayjs";

type TDataType = {
    key: string;
    id: string;
    serial: number;
    name: string;
    details: string;
    image: string;
    file: string;
    createdAt: string;
};

const EbookResources = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const { data: bookResourcesData, isLoading, isError } = useGetBookResourcesQuery({
        page,
        limit,
    });

    // Transform API data to table format
    const tableData: TDataType[] =
        bookResourcesData?.data?.data?.map((resource: IBookResource, index: number) => ({
            key: resource.id,
            id: resource.id,
            serial: (page - 1) * limit + index + 1,
            name: resource.name,
            details: resource.details,
            image: resource.image,
            file: resource.file,
            createdAt: dayjs(resource.createdAt).format("DD MMM, YYYY"),
        })) || [];

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Book Name",
            dataIndex: "name",
            align: "center",
            render: (text: string, record) => (
                <div className="flex justify-center items-center gap-x-2">
                    <AntImage
                        src={record.image || "/book_image.png"}
                        alt="e-book_image"
                        width={60}
                        height={60}
                        className="object-cover rounded-2xl"
                        fallback="/book_image.png"
                    />
                    <p className="font-medium">{text}</p>
                </div>
            ),
        },
        {
            title: "Book Details",
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
            title: "Book PDF",
            dataIndex: "file",
            align: "center",
            render: (_, record) => (
                <Link
                    href={record.file}
                    target="_blank"
                    className="flex-center cursor-pointer"
                >
                    <Image
                        src={pdf_image}
                        alt="pdf file"
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
                        onClick={() => router.push(`/resources-management/book/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                    <Pencil
                        size={20}
                        color="#4378A8"
                        onClick={() => router.push(`/resources-management/edit-book/${record.id}`)}
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
                Failed to load book resources. Please try again.
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={tableData}
            pageSize={limit}
            total={bookResourcesData?.data?.meta?.total}
        />
    );
};

export default EbookResources;