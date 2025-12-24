"use client";

import { Image, TableProps, Spin } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useGetDashboardServicesQuery } from "@/redux/api/dashboardApi";
import { IDashboardService } from "@/types/dashboard.types";
import dayjs from "dayjs";

type TDataType = {
  key: string;
  serial: number;
  id: string;
  name: string;
  subtitle: string;
  image: string;
  date: string;
};

const RecentServiceList = () => {
  // Fetch services from dashboard endpoint
  const {
    data: servicesData,
    isLoading,
    isError,
  } = useGetDashboardServicesQuery();

  // Transform API data to table format
  const tableData: TDataType[] =
    servicesData?.data?.data?.map(
      (service: IDashboardService, index: number) => ({
        key: service.id,
        serial: index + 1,
        id: service.id,
        name: service.serviceName,
        subtitle: service.subTitle,
        image: service.image,
        date: dayjs(service.createdAt).format("DD MMM, YYYY"),
      })
    ) || [];

  const columns: TableProps<TDataType>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      render: (imageUrl: string) => (
        <Image
          src={imageUrl || "/service_image.jpg"}
          alt="service"
          width={60}
          height={60}
          className="object-cover rounded-2xl"
          fallback="/service_image.jpg"
        />
      ),
    },
    {
      title: "Service Name",
      dataIndex: "name",
    },
    {
      title: "Service Sub Title",
      dataIndex: "subtitle",
      render: (text: string) => (
        <p className="max-w-[400px] truncate" title={text}>
          {text}
        </p>
      ),
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
          <Link href={`/service-management/${record.id}`}>
            <Eye
              size={22}
              color="#78C0A8"
              className="cursor-pointer hover:opacity-70 transition-opacity"
            />
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-section-bg rounded-3xl border border-border-color p-4">
        <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
          Service List
        </h1>
        <div className="flex items-center justify-center py-10">
          <Spin size="default" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-section-bg rounded-3xl border border-border-color p-4">
        <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
          Service List
        </h1>
        <div className="flex items-center justify-center py-10 text-red-500">
          Failed to load services.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-section-bg rounded-3xl border border-border-color p-4">
      <h1 className="text-[#000000] text-xl font-medium py-3 px-2">
        Service List
      </h1>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default RecentServiceList;
