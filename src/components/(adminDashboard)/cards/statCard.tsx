import React from "react";

type TProps = {
  title: string;
  amount: string;
};

export default function StatCard({
  title,
  amount,
}: TProps) {
  return (
    <div className="flex flex-col xl:gap-y-2 gap-y-1  justify-center p-6  flex-1 bg-section-bg rounded-xl border border-[#E4E4E7] ">
      <div className="flex justify-between items-center">
        <h3 className=" xl:text-lg text-base text-[#71717A] truncate font-medium">{title}</h3>
      </div>
      <p className="xl:text-3xl lg:text-2xl text-xl font-bold ">{amount}</p>
    </div>
  );
}
