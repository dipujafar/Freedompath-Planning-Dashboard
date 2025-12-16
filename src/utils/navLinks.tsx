import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { BookAudio, CalendarDays, CirclePlus, GitPullRequestCreateArrow } from "lucide-react";
import { BiSupport } from "react-icons/bi";
import { TbShoppingBagMinus } from "react-icons/tb";
import { FaRegStarHalfStroke } from "react-icons/fa6";


export const navLinks = [
  {
    key: "dashboard",
    icon: <RiDashboardHorizontalFill size={18} />,
    label: <Link href={"/dashboard"}>Dashboard</Link>,
  },
  {
    key: "service-management",
    icon: <TbShoppingBagMinus size={18} />,
    label: <Link href={"/service-management"}>Service  Management</Link>,
  },
  {
    key: "testimonial-management",
    icon: <FaRegStarHalfStroke size={18} />,
    label: <Link href={"/testimonial-management"}>Testimonial Management</Link>,
  },
  {
    key: "resources-management",
    icon: <BookAudio size={18} />,
    label: <Link href={"/resources-management"}>Resources Management</Link>,
  },
  {
    key: "add-gyms",
    icon: <CirclePlus size={18} />,
    label: <Link href={"/add-gyms"}>Add Gyms</Link>,
  },
  {
    key: "add-events",
    icon: <CalendarDays size={18} />,
    label: <Link href={"/add-events"}>Add Events</Link>,
  },
  {
    key: "contact-support",
    icon: <BiSupport size={18} />,
    label: <Link href={"/contact-support"}>Contact Support</Link>,
  },
  {
    key: "settings",
    icon: <IoSettingsOutline size={18} />,
    label: <Link href={"/settings"}>Settings</Link>,
  },
  // {
  //   key: "logout",
  //   icon: <RiLogoutCircleLine size={18} />,
  //   label: <Link href={"/login"}>Logout</Link>,
  // },
];
