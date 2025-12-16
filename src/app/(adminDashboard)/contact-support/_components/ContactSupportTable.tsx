"use client";
import { Input, TableProps } from "antd";
import { useState } from "react";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import ContactSupportModal from "@/components/(adminDashboard)/modals/contactSupport/ContactSupportModal";


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
}));



const ContactSupportTable = () => {
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
      <ContactSupportModal open={open} setOpen={setOpen}></ContactSupportModal>
    </div>
  );
};

export default ContactSupportTable;
