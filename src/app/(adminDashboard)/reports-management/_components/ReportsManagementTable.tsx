"use client";;
import { Image as AntImage, TableProps } from "antd";
import Image from "next/image";
import DataTable from "@/utils/DataTable";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import pdf_image from "@/assets/image/pdf_image.png"
import resourceImage from "@/assets/image/resources_image.png";

type TDataType = {
    key?: number;
    serial: number;
    name: string;
    email: string;
    link: string;
    date: string;
    price: string
};

const data: TDataType[] = Array.from({ length: 8 }).map((_, inx) => ({
    key: inx,
    serial: inx + 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    link: "#",
    date: "11 Sep, 2025",
    price: "$30"
}));



const ReportsManagementTable = () => {
    const router = useRouter();

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Client Name",
            dataIndex: "name",
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Created Date",
            dataIndex: "date",
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
           render: (_, record) => <Link href={record.link} target="_blank" className="flex-center gap-x-1 cursor-pointer">
                <Image src={pdf_image} alt="service" width={25} height={25} className="object-cover rounded-2xl" />,
                <div><Trash2 color="red" /></div>
            </Link>
        },
    ];

    return (
        <DataTable columns={columns} data={data} pageSize={40}></DataTable>
    );
};

export default ReportsManagementTable;