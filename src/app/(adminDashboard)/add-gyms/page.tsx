import React from "react";
import AllGymsContainer from "./_components/AllGymsContainer";
import HeaderAndAddButton from "./_components/HeaderAndAddButton";
import FilterOptions from "@/components/shared/FilterOptions";

export default function AddGymsPage() {
  return (
    <div className="lg:space-y-6 space-y-4">
      <HeaderAndAddButton />
      <FilterOptions/>
      <AllGymsContainer />
    </div>
  );
}
