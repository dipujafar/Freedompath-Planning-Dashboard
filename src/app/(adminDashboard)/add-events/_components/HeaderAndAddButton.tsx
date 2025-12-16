"use client";
import AddEventModal from "@/components/(adminDashboard)/modals/addEvent/AddEventModal";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function HeaderAndAddButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <h3 className="lg:text-3xl md:text-3xl text-lg text-[#333] font-medium">
          Event Listing
        </h3>
        <Button onClick={() => setOpen(true)} className="!h-[40px]">
          <PlusCircle /> Add Event
        </Button>
      </div>
      <AddEventModal open={open} setOpen={setOpen} />
    </>
  );
}
