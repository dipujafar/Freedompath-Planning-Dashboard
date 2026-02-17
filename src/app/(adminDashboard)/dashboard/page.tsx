"use client";

import { useState } from "react";
import RecentServiceList from "./_components/RecentServiceList/RecentServiceList";
import StatContainer from "./_components/stats/StatContainer";
import ViewReportChart from "./_components/ViewReportChart/ViewReportChart";

const DashboardPage = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  return (
    <div className="lg:space-y-7 space-y-5 ">
      <StatContainer selectedYear={selectedYear} />
      <ViewReportChart selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <RecentServiceList />
    </div>
  );
};

export default DashboardPage;
