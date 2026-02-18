import { RiDashboardHorizontalFill, RiHomeSmileFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { BookAudio, BookmarkCheck, BookOpenText, FileDown, NotebookText, UsersRound } from "lucide-react";
import { TbShoppingBagMinus } from "react-icons/tb";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { BsImageFill } from "react-icons/bs";


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
    key: "about-us-management",
    icon: <NotebookText size={18} />,
    label: <Link href={"/about-management"}>About us Management</Link>,
  },
  {
    key: "associates-management",
    icon: <UsersRound size={18} />,
    label: <Link href={"/associates-management"}>Associates Management</Link>,
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
    key: "ebook-download",
    icon: <FileDown size={18} />,
    label: <Link href={"/ebook-download"}>Ebook Download</Link>,
  },
  {
    key: "book-management",
    icon: <BookOpenText size={18} />,
    label: <Link href={"/book-management"}>Book Management</Link>,
  },
  {
    key: "blog-management",
    icon: <BsImageFill size={18} />,
    label: <Link href={"/blog-management"}>Blog Management</Link>,
  },
  {
    key: "reports-management",
    icon: <BookmarkCheck size={18} />,
    label: <Link href={"/reports-management"}>Reports Management</Link>,
  },
  {
    key: "homepage-management",
    icon: <RiHomeSmileFill size={18} />,
    label: <Link href={"/homepage-management"}>Homepage Management</Link>,
  },
  {
    key: "footer-management",
    icon: <BookmarkCheck size={18} />,
    label: <Link href={"/footer-management"}>Footer Management</Link>,
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

