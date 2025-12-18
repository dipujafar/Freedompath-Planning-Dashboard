"use client";;
import { TableProps } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import resourceImage from "@/assets/image/resources_image.png";
import Image from "next/image";
import Link from "next/link";

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
    name: "Investment Calculator",
    subtitle: "Calculate potential returns on your gaps investment portfolio with ",
    link: "#",
    date: "11 Sep, 2025",
}));



const ToolResources = () => {
    const router = useRouter();

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Tool Name",
            dataIndex: "name",
        },
        {
            title: "Sub Title",
            dataIndex: "subtitle",
            render: (text) => <p className="max-w-[400px]">{text}</p>,
        },
        {
            title: "Listing Date",
            dataIndex: "date",
        },
        {
            title: "Resource Link",
            dataIndex: "date",
            align: "center",
            render: (_, record) => <Link href={record.link} className="flex-center cursor-pointer">
                <Image src={resourceImage} alt="service" width={25} height={25} className="object-cover rounded-2xl" />,
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

export default ToolResources;
