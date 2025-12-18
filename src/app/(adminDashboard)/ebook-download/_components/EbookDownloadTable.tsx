"use client";;
import { TableProps } from "antd";
import DataTable from "@/utils/DataTable";

type TDataType = {
    key?: number;
    serial: number;
    name: string;
    email: string;
    countryName: string;
    bookName: string;
    date: string;
};

const data: TDataType[] = Array.from({ length: 8 }).map((_, inx) => ({
    key: inx,
    serial: inx + 1,
    name: "Steve Smith",
    email: "steve@gmail.com",
    countryName: "Your Company",
    bookName: "Investment Calculator",
    date: "10:00 AM. 12 Dec",
}));



const EbookDownloadTable = () => {

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Client Name",
            dataIndex: "name",
        },
        {
            title: "Email Address",
            dataIndex: "email"
        },
        {
            title: "Company Name",
            dataIndex: "countryName",
        },
        {
            title: "Ebook Name",
            dataIndex: "bookName",
        },
        {
            title: "Download Date",
            dataIndex: "date",
        },
    ];

    return (
        <DataTable columns={columns} data={data} pageSize={40}></DataTable>
    );
};

export default EbookDownloadTable;
