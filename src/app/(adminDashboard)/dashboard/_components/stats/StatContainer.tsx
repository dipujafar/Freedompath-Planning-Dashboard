"use client";

import StatCard from "@/components/(adminDashboard)/cards/statCard";
import { useGetDashboardCardsQuery } from "@/redux/api/dashboardApi";
import { Spin } from "antd";

export default function StatContainer() {
  const { data: cardsData, isLoading, isError } = useGetDashboardCardsQuery();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:gap-5 gap-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 bg-white rounded-xl border border-border-color flex items-center justify-center"
          >
            <Spin />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load dashboard statistics
      </div>
    );
  }

  const stats = cardsData?.data;

  const statData = [
    {
      id: 1,
      title: "Total Viewers",
      amount: stats?.totalViewers?.toLocaleString() || "0",
    },
    {
      id: 2,
      title: "Total Report",
      amount: stats?.totalReports?.toLocaleString() || "0",
    },
    {
      id: 3,
      title: "Total Download",
      amount: stats?.totalDownloads?.toLocaleString() || "0",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:gap-5 gap-3">
      {statData.map((item) => (
        <div key={item.id}>
          <StatCard {...item} />
        </div>
      ))}
    </div>
  );
}
