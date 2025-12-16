import { CancelIcon, CheckIcon, ClockIcon, FilterIcon } from "@/icon";
import React from "react";

const requestData = [
  {
    id: 1,
    name: "Total Requests",
    stat: "1220",
    icon: <FilterIcon />,
    color: "#DBEAFE",
  },
  {
    id: 2,
    name: "Pending",
    stat: "50",
    icon: <ClockIcon />,
    color: "#FEF9C2",
  },
  {
    id: 3,
    name: "Approved",
    stat: "40",
    icon: <CheckIcon />,
    color: "#DCFCE7",
  },
  {
    id: 4,
    name: "Rejected",
    stat: "20",
    icon: <CancelIcon />,
    color: "#FFE2E2",
  },
];

export default function GymRequestStat() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:gap-10 md:gap-5 gap-3 ">
      {requestData.map((item) => (
        <div key={item.id} className="flex justify-between items-center gap-2 bg-[#fff] p-6 rounded-lg">
          <div className="space-y-1">
            <p className="text-sm text-[#4A5565]">{item.name}</p>
            <p className="text-xl font-semibold">{item.stat}</p>
          </div>

          <div
            className="w-10 h-10 flex justify-center items-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
