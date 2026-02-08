import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="relative h-screen w-full">
      <Image
        src={"/blog_image_3.png"}
        alt="auth_page_image"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
