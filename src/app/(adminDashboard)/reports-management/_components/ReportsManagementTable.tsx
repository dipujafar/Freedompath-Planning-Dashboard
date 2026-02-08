"use client";;
import { Popconfirm, PopconfirmProps, TableProps } from "antd";
import Image from "next/image";
import DataTable from "@/utils/DataTable";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import pdf_image from "@/assets/image/pdf_image.png"
import { useDeleteReportMutation, useGetReportQuery } from "@/redux/api/generateReportApi";
import moment from "moment";
import { toast } from "sonner";


type TDataType = {
    key?: number;
    serial: number;
    name: string;
    email: string;
    link: string;
    date: string;
    pdf: string;
    id: string;
};





const ReportsManagementTable = () => {

    const page = useSearchParams().get("page") || "1";
    const limit = useSearchParams().get("limit") || "10";

    const queries: Record<string, string> = {};

    if (page) queries["page"] = page;
    if (limit) queries["limit"] = limit;

    const { data: reportsData, isLoading } = useGetReportQuery(queries);
    const [deleteReport] = useDeleteReportMutation();

    const confirm = async (id: string) => {
        try {
            await deleteReport(id).unwrap();
            toast.success("Report deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };


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
            dataIndex: "createdAt",
            render: (text) => moment(text).format("lll")
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (_, record) => <div className="flex-center gap-x-2 cursor-pointer">
                <Link href={record?.pdf} target="_blank" className="flex-center gap-x-1 cursor-pointer">
                    <Image src={pdf_image} alt="service" width={25} height={25} className="object-cover rounded-2xl" />
                </Link>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => confirm(record?.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <div><Trash2 color="red" /></div>
                </Popconfirm>

            </div>
        },
    ];

    return (
        <DataTable columns={columns} data={reportsData?.data?.data} isLoading={isLoading} pageSize={Number(limit)} total={reportsData?.data?.meta?.total}></DataTable>
    );
};

export default ReportsManagementTable;