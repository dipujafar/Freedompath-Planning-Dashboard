"use client";

import { Select, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";
import { useGetDashboardChartQuery } from "@/redux/api/dashboardApi";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ViewReportChart = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const { data: chartData, isLoading, isError } = useGetDashboardChartQuery();

  const yearsOption = Array(5)
    .fill(0)
    .map((_, index) => new Date().getFullYear() - index);

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  // Transform API data to chart format
  const transformedData = useMemo(() => {
    if (!chartData?.data) {
      return monthNames.map((name) => ({
        name,
        report: 0,
        diff: 0,
      }));
    }

    // Find max value for diff calculation
    const maxValue = Math.max(...chartData.data.map((item) => item.total), 100);

    return chartData.data.map((item) => ({
      name: monthNames[item.month - 1] || "",
      report: item.total,
      diff: Math.max(0, maxValue - item.total),
    }));
  }, [chartData]);

  const customTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#fff] p-3 rounded-lg shadow-md">
          <p className="label">{`${payload[0].value} reports`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg p-8 w-full bg-[#fff] border border-border-color">
      <div className="flex lg:flex-wrap xl:flex-nowrap justify-between items-center mb-10 gap-2">
        <h1 className="text-xl text-black font-medium">View Report</h1>

        <div className="flex gap-x-2 items-center">
          <Select
            value={selectedYear}
            style={{ width: 120 }}
            onChange={handleChange}
            options={yearsOption.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            }))}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          Failed to load chart data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={transformedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Bar
              dataKey="report"
              stackId="a"
              fill="var(--color-main)"
              barSize={50}
            />
            <Bar
              dataKey="diff"
              stackId="a"
              fill="var(--color-secondary)"
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ViewReportChart;
