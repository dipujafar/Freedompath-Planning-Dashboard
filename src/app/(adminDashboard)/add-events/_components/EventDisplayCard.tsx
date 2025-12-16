"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { message, Popconfirm, PopconfirmProps } from "antd";
import moment from "moment";
import AddEventModal from "@/components/(adminDashboard)/modals/addEvent/AddEventModal";
import { useState } from "react";

interface EventCardProps {
  name: string;
  address: string;
  image: string;
  tags: string[];
  date: string;
}

const confirmBlock: PopconfirmProps["onConfirm"] = (e) => {
  console.log(e);
  message.success("Deleted the event");
};

const color = ["#CC5767", "#22C65F", "#FFBB24", "#0066FF"];

const randomColorPick = () => {
  return color[Math.floor(Math.random() * color.length)];
};

export function EventDisplayCard({
  name,
  address,
  image,
  tags,
  date,
}: EventCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  return (
    <>
      <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm p-2">
        <div className="relative h-[160px] w-full">
          <div>
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover rounded"
            />

            <div className="absolute top-2 left-2 bg-white text-center p-2 rounded-md  ">
              <p className="text-[#8A8A8A] font-medium">
                {moment(date).format("MMM")}
              </p>
              <p className="text-main-color font-semibold">
                {moment(date).format("DD")}
              </p>
              <p className="text-[#8A8A8A] font-medium">
                {moment(date).format("YYYY")}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="py-2 px-0 ">
          <h3 className="font-semibold text-base text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-x-1">
            <MapPin size={14} /> {address}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                style={{ backgroundColor: randomColorPick() }}
                className="px-3 py-1 text-xs font-medium text-white rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Popconfirm
              title="Delete the event"
              description="Are you sure to delete this event?"
              onConfirm={confirmBlock}
              okText="Yes"
              cancelText="No"
            >
              <Button
                variant="outline"
                size={"sm"}
                className="flex-1 text-sm font-medium border-main-color text-main-color hover:bg-gray-50 bg-transparent"
              >
                Delete
              </Button>
            </Popconfirm>

            <Button
              size={"sm"}
              className="flex-1 text-sm font-medium bg-main-color hover:bg-red-700 text-white"
              onClick={() => {
                setOpen(true);
                setSelectedId(1);
              }}
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddEventModal open={open} setOpen={setOpen} selectedId={selectedId} />
    </>
  );
}
