import PaginationSection from "@/components/shared/PaginationSection";
import { GymDisplayCard } from "./GymDisplayCard";

const gyms = [
  {
    id: 1,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 2,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 3,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 4,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 5,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 6,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 7,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 8,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 9,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
  {
    id: 10,
    name: "GymNation Stars",
    address: "6 3157 Rd, California, USA",
    image: "/gym_image.png",
    tags: ["Open Mat", "BJJ", "MMA"],
  },
];

export default function AllGymsContainer() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 border border-gray-300 lg:p-6 p-2 rounded-2xl bg-[#F9F9FA] ">
        {gyms.map((gym) => (
          <GymDisplayCard
            key={gym.id}
            name={gym.name}
            address={gym.address}
            image={gym.image}
            tags={gym.tags}
          />
        ))}
      </div>
      <PaginationSection total={20} current={1} />
    </div>
  );
}
