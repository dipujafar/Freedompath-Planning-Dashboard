import { Metadata } from "next";

import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { OtpVerificationForm } from "@/components/(auth)/verifyEmail/VerifyForm";

export const metadata: Metadata = {
  title: "Forget Password",
};

const verifyEmail = () => {
  return <div> <OtpVerificationForm /> </div>;
};

export default verifyEmail;
