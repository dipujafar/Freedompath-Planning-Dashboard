"use client";
import { Input, TableProps } from "antd";
import { useState } from "react";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import GymRequestModal from "@/components/(adminDashboard)/modals/GymRequestModal";

type TDataType = {
  key?: number;
  serial: number;
  name: string;
  email: string;
  date: string;
};

const data: TDataType[] = Array.from({ length: 20 }).map((data, inx) => ({
  key: inx,
  serial: inx + 1,
  name: "Caleb Shirtum ",
  email: "calebshirtum@gmail.com",
  phoneNumber: "+9112655423",
  date: "7 oct, 2025",
  status: inx % 2 === 0 ? "Approved" : "Pending",
}));

const GymRequestsTable = () => {
  const [open, setOpen] = useState(false);

  const columns: TableProps<TDataType>["columns"] = [
    {
      title: "Serial",
      dataIndex: "serial",
      render: (text) => <p>#{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Status Type",
      dataIndex: "status",
      render: (text) => (
        <p
          className={cn(
            "capitalize",
            text === "Approved" ? "text-[#00B047]" : "text-[#123CA6]"
          )}
        >
          {text}
        </p>
      ),
    },

    {
      title: "Date",
      dataIndex: "date",
      align: "center",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex items-center gap-x-1">
          <Eye size={22} color="#78C0A8" onClick={() => setOpen(true)} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-section-bg rounded-3xl">
      <div className="max-w-[400px] ml-auto mb-2 pt-2">
        <Input.Search placeholder="Search here..." size="large" />
      </div>
      <DataTable columns={columns} data={data} pageSize={10}></DataTable>
      <GymRequestModal open={open} setOpen={setOpen}></GymRequestModal>
    </div>
  );
};

export default GymRequestsTable;
