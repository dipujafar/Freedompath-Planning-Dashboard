import { ForgetPassForm } from "@/components/(auth)/forgetPassword/ForgetPassForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forget Password",
};

const ForgetPasswordPage = () => {
  return <div> <ForgetPassForm /></div>;
};

export default ForgetPasswordPage;
