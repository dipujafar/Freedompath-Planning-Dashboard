"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { message, Popconfirm, PopconfirmProps } from "antd";
import { AddGymModal } from "@/components/(adminDashboard)/modals/AddGym/AddGymModal";
import { useState } from "react";

interface GymCardProps {
  name: string;
  address: string;
  image: string;
  tags: string[];
}

const confirmBlock: PopconfirmProps["onConfirm"] = (e) => {
  console.log(e);
  message.success("Deleted the gym");
};

export function GymDisplayCard({ name, address, image, tags }: GymCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  return (
    <>
      <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm p-2">
        <div className="relative h-[160px] w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover rounded"
          />
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
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Popconfirm
              title="Delete the gym"
              description="Are you sure to delete this gym?"
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
      <AddGymModal open={open} onOpenChange={setOpen} selectedId={selectedId} />
    </>
  );
}
