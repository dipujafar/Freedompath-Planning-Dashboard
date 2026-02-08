"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LogoSection from "../LogoSection";
import { useRouter } from "next/navigation";
import { useRef, type KeyboardEvent, useEffect, useState } from "react";
import { OtpFormValues, otpSchema } from "./schema";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authSlice";

export function OtpVerificationForm() {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Get email and token from session storage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    const storedToken = sessionStorage.getItem("resetToken");

    if (storedEmail && storedToken) {
      setEmail(storedEmail);
      setResetToken(storedToken);
    } else {
      // No email/token in session, redirect back to forgot password
      router.push("/forget-password");
    }
  }, [router]);

  // Create refs for each input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Get current OTP value
    const currentOtp = form.getValues("otp");
    const otpArray = currentOtp.padEnd(6, " ").split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").replace(/ /g, "");

    form.setValue("otp", newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace") {
      const currentOtp = form.getValues("otp");
      const otpArray = currentOtp.padEnd(6, " ").split("");

      if (!otpArray[index] || otpArray[index] === " ") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        otpArray[index] = " ";
        const newOtp = otpArray.join("").replace(/ /g, "");
        form.setValue("otp", newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      form.setValue("otp", pastedData);
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const onSubmit = async (values: OtpFormValues) => {
    if (!resetToken) {
      toast.error("Session expired. Please request a new OTP.");
      router.push("/forget-password");
      return;
    }

    try {
      const result = await verifyOtp({ otp: values.otp, token: resetToken }).unwrap();

      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");

        // Store the user and token in Redux
        dispatch(
          setUser({
            user: result.data.user,
            token: result.data.token,
          })
        );

        // Clear session storage
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");

        // Redirect to reset password page
        router.push("/reset-password");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      router.push("/forget-password");
      return;
    }

    try {
      const result = await resendOtp({ email }).unwrap();

      if (result.success) {
        toast.success(result.message || "OTP sent successfully!");
        // Update token in session storage and state
        if (result.data.token) {
          sessionStorage.setItem("resetToken", result.data.token);
          setResetToken(result.data.token);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP.");
    }
  };

  const otpValue = form.watch("otp").padEnd(6, " ");

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left Side - Purple Gradient with Logo */}
      <div className="flex-1">
        <LogoSection />
      </div>
      {/* Right Side - OTP Verification Form */}
      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Verify Email</h2>
            <p className="text-gray-600">
              Please enter the OTP we have sent you to{" "}
              <span className="font-medium text-main-color">{email}</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Input Fields */}
              <FormField
                control={form.control}
                name="otp"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            key={index}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={
                              otpValue[index] === " " ? "" : otpValue[index]
                            }
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-main-color focus:ring-main-color"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full h-12 bg-main-color hover:bg-red-700 text-white font-medium text-base"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-main-color font-medium hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
