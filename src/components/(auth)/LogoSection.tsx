import Image from "next/image";
import authPageImage from "@/assets/image/auth-pages-cover-image.png";

export default function LogoSection() {
  return (
    <Image
      src={authPageImage}
      alt="auth_page_image"
      className="h-screen object-cover"
    ></Image>
  );
}
