"use client";
import { Avatar, Flex } from "antd";
import { FaBars } from "react-icons/fa6";
import avatarImg from "@/assets/image/user_image.png";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";

type TNavbarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Navbar = ({ collapsed, setCollapsed }: TNavbarProps) => {
  return (
    <div className="flex items-center justify-between w-[97%] font-poppins">
      {/* Header left side */}
      <Flex align="center" gap={20}>
        <button
          onClick={() => setCollapsed(collapsed ? false : true)}
          className="cursor-pointer hover:bg-gray-300 rounded-full duration-1000"
        >
          {collapsed ? (
            <X size={28} color="#3A3C3B" />
          ) : (
            <FaBars size={28} color="#3A3C3B" />
          )}
        </button>
        <div className="flex flex-col ">
          <h2 className="md:text-2xl text-lg  font-medium text-[#3A3C3B]">
            Welcome, Steve
            <span className="block  text-sm font-normal">here's what's happening with your Website today</span>
          </h2>
        </div>
      </Flex>

      {/* Header right side */}
      <Flex align="center" gap={20}>

        <Menubar className="py-6 rounded-full ">
          <MenubarMenu >
            <MenubarTrigger className="shadow-none px-0 rounded-full py-2">
              <div className="flex items-center gap-x-2  px-2 h-fit">
                <p className="text-black">Steve</p>
                <Avatar
                  src={avatarImg.src}
                  size={40}
                  className="size-12"
                ></Avatar>
              </div>
            </MenubarTrigger>

            <MenubarContent className="text-primary-gray">
              <Link href={"/personal-information"}>
                <MenubarItem className="hover:bg-gray-100 cursor-pointer">
                  Profile{" "}
                  <MenubarShortcut>
                    <ChevronRight size={16} />
                  </MenubarShortcut>
                </MenubarItem>
              </Link>
              <MenubarSeparator />
              <Link href={"/login"}>
                <MenubarItem className="hover:bg-gray-100 cursor-pointer">
                  Logout
                </MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Flex>
    </div>
  );
};

export default Navbar;
