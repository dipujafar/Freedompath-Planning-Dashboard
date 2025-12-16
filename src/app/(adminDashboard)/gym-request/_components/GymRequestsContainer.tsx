import React from "react";
import GymRequestStat from "./GymRequestStat";
import GymRequestsTable from "./GymRequestsTable";

export default function GymRequestsContainer() {
  return (
    <div className="space-y-10">
      <GymRequestStat />
      <GymRequestsTable />
    </div>
  );
}
