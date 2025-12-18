"use client";;
import { Image as AntImage, TableProps } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type TDataType = {
    key?: number;
    serial: number;
    name: string;
    bio: string;
};

const data: TDataType[] = Array.from({ length: 8 }).map((_, inx) => ({
    key: inx,
    serial: inx + 1,
    name: "The Definitive Guide",
    bio: "Business owners who are seeking to have someone proactively represent their best interests, both personally and professionally..",
}));



const AddAssociatesTable = () => {
    const router = useRouter();

    const columns: TableProps<TDataType>["columns"] = [
        {
            title: "Image",
            dataIndex: "image",
            align: "center",
            render: (text) => <div className="flex justify-center items-center gap-x-2">
                <AntImage src={"/user_image.png"} alt="e-book_image" width={60} height={60} className="object-cover rounded-2xl" />
                
            </div>
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text) => <p className="max-w-[400px]">{text}</p>,
        },
        {
            title: "Bio",
            dataIndex: "bio",
            render: (text) => <p className="max-w-[500px]">{text}</p>,
        },
       
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <Eye size={22} color="#78C0A8" onClick={() => router.push(`/book-management/add-book`)} className="cursor-pointer" />
            ),
        },
    ];

    return (
        <DataTable columns={columns} data={data} pageSize={40}></DataTable>
    );
};

export default AddAssociatesTable;