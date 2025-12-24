"use client";

import { Avatar, Flex } from "antd";
import { FaBars } from "react-icons/fa6";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

type TNavbarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Navbar = ({ collapsed, setCollapsed }: TNavbarProps) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get user's first name for display
  const displayName = user?.name?.split(" ")[0] || "User";

  // Get initials for avatar placeholder (first letter of name)
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

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
            Welcome, {displayName}
            <span className="block  text-sm font-normal">
              here's what's happening with your Website today
            </span>
          </h2>
        </div>
      </Flex>

      {/* Header right side */}
      <Flex align="center" gap={20}>
        <Menubar className="py-6 rounded-full ">
          <MenubarMenu>
            <MenubarTrigger className="shadow-none px-0 rounded-full py-2">
              <div className="flex items-center gap-x-2  px-2 h-fit">
                <p className="text-black">{displayName}</p>
                {user?.profile ? (
                  <Avatar src={user.profile} size={40} className="size-12" />
                ) : (
                  <Avatar
                    size={40}
                    className="size-12 bg-main-color text-white font-semibold"
                    style={{
                      backgroundColor: "var(--color-main)",
                      color: "#ffffff",
                    }}
                  >
                    {getInitials(user?.name || "U")}
                  </Avatar>
                )}
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
              <MenubarItem
                className="hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Flex>
    </div>
  );
};

export default Navbar;
