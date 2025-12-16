"use client";
import { Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const data = [
  { name: "Jan", report: 100, diff: 320 - 100 },
  { name: "Feb", report: 310, diff: 320 - 310 },
  { name: "Mar", report: 150, diff: 320 - 150 },
  { name: "Apr", report: 150, diff: 320 - 150 },
  { name: "May", report: 180, diff: 320 - 180 },
  { name: "Jun", report: 200, diff: 320 - 200 },
  { name: "Jul", report: 320, diff: 320 - 320 },
  { name: "Aug", report: 230, diff: 320 - 230 },
  { name: "Sep", report: 250, diff: 320 - 250 },
  { name: "Oct", report: 180, diff: 320 - 180 },
  { name: "Nov", report: 300, diff: 320 - 300 },
  { name: "Dec", report: 150, diff: 320 - 150 },
];

const ViewReportChart = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const yearsOption = Array(5)
    .fill(0)
    .map((_, index) => new Date().getFullYear() - index);

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

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
    <div className="  rounded-lg p-8 w-full bg-[#fff] border border-border-color ">
      <div className="flex lg:flex-wrap xl:flex-nowrap justify-between items-center mb-10 gap-2">
        <h1 className="text-xl text-black font-medium">View Report</h1>

        <div className="flex gap-x-2 items-center ">
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

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
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
          {/* <Legend /> */}

          <Bar dataKey="report" stackId="a" fill="var(--color-main)" barSize={50} />
          <Bar dataKey="diff" stackId="a" fill="var(--color-secondary)" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewReportChart;
