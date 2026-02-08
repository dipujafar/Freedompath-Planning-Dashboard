"use client";

import { Image as AntImage, TableProps, Spin } from "antd";
import Image from "next/image";
import DataTable from "@/utils/DataTable";
import { Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import pdf_image from "@/assets/image/pdf_image.png";
import { useGetBooksQuery } from "@/redux/api/booksApi";
import { IBook } from "@/types/book.types";
import dayjs from "dayjs";

type TDataType = {
    key: string;
    id: string;
    name: string;
    details: string;
    image: string;
    file: string;
    price: number;
    downloads: number;
    createdAt: string;
};

const BookManagementTable = () => {
    const router = useRouter();
    const { data: booksData, isLoading, isError } = useGetBooksQuery();

    // Transform API data to table format
    const tableData: TDataType[] =
        booksData?.data?.data?.map((book: IBook) => ({
            key: book.id,
            id: book.id,
            name: book.name,
            details: book.details,
            image: book.image,
            file: book.file,
            price: book.price,
            downloads: book.downloads,
            createdAt: dayjs(book.createdAt).format("DD MMM, YYYY"),
        })) || [];

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Book Name",
            dataIndex: "name",
            align: "center",
            render: (text: string, record) => (
                <div className="flex justify-center items-center gap-x-2">
                    <AntImage
                        src={record.image || "/book.png"}
                        alt="book_image"
                        width={60}
                        height={60}
                        className="object-cover rounded-2xl"
                        fallback="/book.png"
                    />
                    <p className="font-medium">{text}</p>
                </div>
            ),
        },
        {
            title: "Book Details",
            dataIndex: "details",
            render: (text: string) => (
                <p className="max-w-[300px] truncate" title={text}>
                    {text}
                </p>
            ),
        },
        {
            title: "Book PDF",
            dataIndex: "file",
            align: "center",
            render: (_, record) => (
                <Link
                    href={record.file || "#"}
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
            title: "Book Price",
            dataIndex: "price",
            align: "center",
            render: (price: number) => (
                <span className="font-medium text-main-color">${price}</span>
            ),
        },
        {
            title: "Downloads",
            dataIndex: "downloads",
            align: "center",
            render: (downloads: number) => <span>{downloads}</span>,
        },
        {
            title: "Listing Date",
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
                        onClick={() => router.push(`/book-management/${record.id}`)}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                    />
                    <Pencil
                        size={20}
                        color="#4378A8"
                        onClick={() => router.push(`/book-management/edit/${record.id}`)}
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
                Failed to load books. Please try again.
            </div>
        );
    }

    return <DataTable columns={columns} data={tableData} pageSize={10} />;
};

export default BookManagementTable;