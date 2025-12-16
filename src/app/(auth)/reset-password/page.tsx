import { Metadata } from "next";
import { IoIosArrowRoundBack } from "react-icons/io";

import Link from "next/link";
import { ResetPasswordForm } from "@/components/(auth)/setNewPassword/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Forget Password",
};

const ResetPassword = () => {
  return <ResetPasswordForm />;
};

export default ResetPassword;
