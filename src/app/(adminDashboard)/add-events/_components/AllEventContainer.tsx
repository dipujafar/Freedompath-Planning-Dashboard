import PaginationSection from "@/components/shared/PaginationSection";
import { EventDisplayCard } from "./EventDisplayCard";

const events = [
  {
    id: 1,
    name: "2025 Chattanooga Open    ",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 2,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 3,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 4,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 5,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 6,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 7,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 8,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 9,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
  {
    id: 10,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/event-image.png",
    tags: ["AGF", "1 Day", "$75 "],
    date: "2025-10-08T19:16:00.000Z",
  },
];

export default function AllEventContainer() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 border border-gray-300 lg:p-6 p-2 rounded-2xl bg-[#F9F9FA] ">
        {events.map((event) => (
          <EventDisplayCard
            key={event.id}
            name={event.name}
            address={event.address}
            image={event.image}
            tags={event.tags}
            date={event.date}
          />
        ))}
      </div>
      <PaginationSection total={20} current={1} />
    </div>
  );
}
