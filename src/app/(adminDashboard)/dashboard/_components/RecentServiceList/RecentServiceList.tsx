"use client";;
import { Image, TableProps } from "antd";
import { useState } from "react";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import Link from "next/link";

type TDataType = {
  key?: number;
  serial: number;
  name: string;
  subtitle: string;
  date: string;
};

const data: TDataType[] = Array.from({ length: 5 }).map((_, inx) => ({
  key: inx,
  serial: inx + 1,
  name: "CPA/Exit Planning",
  subtitle: "Strategic roadmap to maximize value and ensure successful business transition.",
  phoneNumber: "+9112655423",
  type: "User",
  date: "11 Sep, 2025",
}));



const RecentServiceList = () => {
  const [open, setOpen] = useState(false);

  const columns: TableProps<TDataType>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      render: () => <Image src={"/service_image.jpg"} alt="service" width={60} height={60} className="object-cover rounded-2xl" />,
    },
    {
      title: "Service Name",
      dataIndex: "name",
    },
    {
      title: "Service Sub Title",
      dataIndex: "subtitle",
      render: (text) => <p className="max-w-[400px]">{text}</p>,
    },
    {
      title: "Listing Date",
      dataIndex: "date",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex items-center gap-x-1">
          <Link href={`/service-management/${record.key}`}>
            <Eye size={22} color="#78C0A8" onClick={() => setOpen(!open)} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-section-bg rounded-3xl border border-border-color p-4">
      <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
        Service List
      </h1>
      <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
};

export default RecentServiceList;
