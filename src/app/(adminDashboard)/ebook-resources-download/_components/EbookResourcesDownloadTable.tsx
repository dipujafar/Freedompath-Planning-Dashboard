"use client";
import { TableProps, Image, Spin, Tooltip } from "antd";
import DataTable from "@/utils/DataTable";
import { useGetEbookDownloadsQuery } from "@/redux/api/ebookDownloadApi";
import { IEbookDownload } from "@/redux/api/ebookDownloadApi";
import { FileDown } from "lucide-react";

const EbookResourcesDownloadTable = () => {
    const { data, isLoading } = useGetEbookDownloadsQuery();

    const downloads = data?.data?.data || [];

    const columns: TableProps<IEbookDownload>["columns"] = [
        {
            title: "SL",
            dataIndex: "serial",
            key: "serial",
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Client Name",
            dataIndex: "username",
            key: "username",
            render: (text: string) => (
                <span className="font-medium">{text}</span>
            ),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            render: (text: string) => (
                <a href={`mailto:${text}`} className="text-blue-600 hover:underline">
                    {text}
                </a>
            ),
        },
        {
            title: "Company Name",
            dataIndex: "company",
            key: "company",
        },
        {
            title: "Book",
            key: "book",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.book?.image}
                        alt={record.book?.name || "Book"}
                        width={40}
                        height={50}
                        className="rounded object-cover"
                        fallback="/placeholder-book.png"
                    />
                    <span className="font-medium">{record.book?.name}</span>
                </div>
            ),
        },
        {
            title: "Download Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => {
                try {
                    const d = new Date(date);
                    return d.toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                } catch {
                    return date;
                }
            },
        },
        {
            title: "File",
            key: "file",
            width: 100,
            render: (_, record) => (
                record.book?.file ? (
                    <Tooltip title="View/Download File">
                        <a
                            href={record.book.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-main-color text-white hover:bg-opacity-90 transition-colors text-sm"
                        >
                            <FileDown size={16} />
                            View
                        </a>
                    </Tooltip>
                ) : (
                    <span className="text-gray-400">N/A</span>
                )
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={downloads.map((item, index) => ({ ...item, key: item.id || index }))}
            pageSize={10}
        />
    );
};

export default EbookResourcesDownloadTable;
