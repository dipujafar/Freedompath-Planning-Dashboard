"use client";;
import { Image as AntImage, TableProps } from "antd";
import Image from "next/image";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import pdf_image from "@/assets/image/pdf_image.png"

type TDataType = {
    key?: number;
    serial: number;
    name: string;
    subtitle: string;
    link: string;
    date: string;
};

const data: TDataType[] = Array.from({ length: 8 }).map((_, inx) => ({
    key: inx,
    serial: inx + 1,
    name: "The Definitive Guide",
    subtitle: "Complete guide to digital marketing strategies and modern techniques for business growth.",
    link: "#",
    date: "11 Sep, 2025",
}));



const EbookResources = () => {
    const router = useRouter();

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Book name",
            dataIndex: "name",
            align: "center",
            render: (text) => <div className="flex justify-center items-center gap-x-2">
                <AntImage src={"/book_image.png"} alt="e-book_image" width={60} height={60} className="object-cover rounded-2xl" />
                <p>{text}</p>
            </div>
        },
        {
            title: "Book Sub Title",
            dataIndex: "subtitle",
            render: (text) => <p className="max-w-[400px]">{text}</p>,
        },
        {
            title: "Listing Date",
            dataIndex: "date",
        },
        {
            title: "Book pdf",
            dataIndex: "date",
            align: "center",
            render: (_, record) => <Link href={record.link} target="_blank" className="flex-center cursor-pointer">
                <Image src={pdf_image} alt="service" width={25} height={25} className="object-cover rounded-2xl" />,
            </Link>
        },

        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <Eye size={22} color="#78C0A8" onClick={() => router.push(`/testimonial-management/add-testimonial`)} className="cursor-pointer" />
            ),
        },
    ];

    return (
        <DataTable columns={columns} data={data} pageSize={40}></DataTable>
    );
};

export default EbookResources;