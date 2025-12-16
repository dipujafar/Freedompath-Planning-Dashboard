import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import antTheme from "@/theme/antTheme";
import { Plus_Jakarta_Sans as Poppins } from "next/font/google";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | freedom-path",
    template: "%s | freedom-path",
  },
  description: "This is Official Application Dashboard for freedom-path",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AntdRegistry>
          <ConfigProvider theme={antTheme}>
            <Toaster position="top-center" />
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
