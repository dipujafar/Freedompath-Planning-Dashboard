"use client";
import { Image, TableProps, Spin } from "antd";
import DataTable from "@/utils/DataTable";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetServicesQuery } from "@/redux/api/servicesApi";
import { IService } from "@/types/service.types";
import dayjs from "dayjs";

type TDataType = {
    key: string;
    serial: number;
    id: string;
    name: string;
    title: string;
    subtitle: string;
    image: string;
    date: string;
};

const ServiceManagementTable = () => {
    const router = useRouter();
    const { data: servicesData, isLoading, isError } = useGetServicesQuery();

    // Transform API data to table format
    const tableData: TDataType[] =
        servicesData?.data?.data?.map((service: IService, index: number) => ({
            key: service.id,
            serial: index + 1,
            id: service.id,
            name: service.serviceName,
            title: service.Title,
            subtitle: service.subTitle,
            image: service.image,
            date: dayjs(service.createdAt).format("DD MMM, YYYY"),
        })) || [];

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
            title: "Service Title",
            dataIndex: "title",
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
                <Eye
                    size={22}
                    color="#78C0A8"
                    onClick={() => router.push(`/service-management/${record.id}`)}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                />
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500">
                Failed to load services. Please try again.
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={tableData}
            pageSize={10}
        />
    );
};

export default ServiceManagementTable;
