import StatCard from "@/components/(adminDashboard)/cards/statCard";
import { cn } from "@/lib/utils";
import React from "react";

const statData = [
  {
    id: 1,
    title: "Total Viewers",
    amount: "12,426",
  },
  {
    id: 2,
    title: "Total Report",
    amount: "2,426"
  },
  {
    id: 3,
    title: "Total Download",
    amount: "2,426"
  },
];

export default function StatContainer() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:gap-5 gap-3">
      {statData?.map((item) => (
        <div key={item.id}>
          <StatCard {...item} />
        </div>
      ))}
    </div>
  );
}
