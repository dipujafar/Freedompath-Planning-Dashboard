"use client";

import { Button, ConfigProvider, Form, Input, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import profile from "@/assets/image/adminProfile.png";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Camera, Loader2, Trash2, Eye, EyeOff, Lock } from "lucide-react";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/profileApi";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authSlice";
import Cookies from "js-cookie";

const PersonalInformationContainer = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const [fileName, setFileName] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: profileData, isLoading: isFetching } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Populate form with existing data
  useEffect(() => {
    if (profileData?.data) {
      const userData = profileData.data;
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phoneNumber || "",
      });
      if (userData.profile) {
        setExistingImage(userData.profile);
      }
    }
  }, [profileData, form]);

  const handleSubmit = async (values: { name: string; phone: string }) => {
    const formData = new FormData();

    const jsonData = {
      name: values.name,
      phoneNumber: values.phone,
    };

    formData.append("data", JSON.stringify(jsonData));

    if (fileName) {
      formData.append("profile", fileName);
    }

    try {
      const result = await updateMyProfile(formData).unwrap();

      if (result.success) {
        toast.success("Profile updated successfully!");
        setEdit(false);

        // Update Redux state with new user data
        const token = Cookies.get("famsched-access-token");
        if (token && result.data) {
          dispatch(
            setUser({
              user: {
                id: result.data.id,
                name: result.data.name,
                email: result.data.email,
                status: result.data.status,
                role: result.data.role,
                profile: result.data.profile,
                phoneNumber: result.data.phoneNumber,
                customerId: null,
                expireAt: null,
                isDeleted: false,
                createdAt: result.data.createdAt,
                updatedAt: new Date().toISOString(),
                verification: result.data.verification,
              },
              token,
            })
          );
        }

        // Update existing image if new one was uploaded
        if (fileName && imageUrl) {
          setExistingImage(imageUrl);
          setFileName(null);
          setImageUrl(null);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFileName(file);
    } else {
      setImageUrl(null);
      setFileName(null);
    }

    input.value = "";
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setFileName(null);
    setImageUrl(null);
    // Reset form to original values
    if (profileData?.data) {
      form.setFieldsValue({
        name: profileData.data.name,
        email: profileData.data.email,
        phone: profileData.data.phoneNumber || "",
      });
    }
  };

  // Handle password change
  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const result = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password changed successfully!");
        passwordForm.resetFields();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  // Get initials for avatar placeholder
  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  const userData = profileData?.data;
  const displayImage = imageUrl || existingImage;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span
            onClick={() => route.back()}
            className="cursor-pointer bg-main-color p-2 rounded-full"
          >
            <FaArrowLeft size={20} color="#fff" />
          </span>
          <h4 className="text-2xl font-medium text-text-color">
            Personal Information
          </h4>
        </div>
        <div className={edit ? "hidden" : ""}>
          <Button
            style={{
              backgroundColor: "var(--color-main)",
              border: "none",
              color: "var(--color-secondary)",
            }}
            onClick={() => setEdit(true)}
            size="large"
            icon={<FiEdit />}
          >
            Edit Profile
          </Button>
        </div>
        {edit && (
          <Button
            style={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
            }}
            onClick={handleCancelEdit}
            size="large"
          >
            Cancel
          </Button>
        )}
      </div>
      <hr className="my-4" />

      {/* personal information */}
      <div className="mt-10 flex justify-center flex-col xl:flex-row items-center gap-10">
        <div className="bg-[#fff] h-[365px] md:w-[350px] rounded-xl border border-main-color flex justify-center items-center text-text-color">
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile"
                  width={1200}
                  height={1200}
                  className="size-36 rounded-full flex justify-center items-center object-cover"
                />
              ) : (
                <div
                  className="size-36 rounded-full flex justify-center items-center text-white text-5xl font-bold"
                  style={{ backgroundColor: "var(--color-main)" }}
                >
                  {getInitials(userData?.name || "U")}
                </div>
              )}

              {/* cancel button for new image */}
              {fileName && imageUrl && (
                <div
                  className="absolute left-4 top-2 cursor-pointer rounded-md bg-primary-pink opacity-0 duration-1000 group-hover:opacity-100"
                  onClick={() => {
                    setFileName(null);
                    setImageUrl(null);
                  }}
                >
                  <Trash2 size={20} color="red" />
                </div>
              )}

              {/* upload image - only in edit mode */}
              {edit && (
                <>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <div className="bg-white text-black text-lg p-1 rounded-full absolute bottom-0 right-3 shadow-md hover:bg-gray-100 transition-colors">
                      <Camera size={20} />
                    </div>
                  </label>
                </>
              )}
            </div>
            <h3 className="text-2xl text-center max-w-[280px] break-words">{userData?.name || "Admin"}</h3>
            <p className="text-sm text-center text-muted-foreground">
              {userData?.role || "admin"}
            </p>
          </div>
        </div>

        {/* form */}
        <div className="w-2/4">
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  colorBgContainer: "#fff",
                  colorText: "#333",
                  colorTextPlaceholder: "#999",
                },
                Form: {
                  labelColor: "#333",
                },
              },
            }}
          >
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              style={{
                marginTop: "25px",
              }}
            >
              {/*  input  name */}
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  size="large"
                  placeholder="Enter full name"
                  readOnly={!edit}
                  style={{
                    backgroundColor: edit ? "#fff" : "#f5f5f5",
                  }}
                />
              </Form.Item>

              {/*  input  email - always readonly */}
              <Form.Item label="Email" name="email">
                <Input
                  size="large"
                  placeholder="Enter email"
                  readOnly
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </Form.Item>

              {/* input  phone number  */}
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Phone number"
                  readOnly={!edit}
                  style={{
                    backgroundColor: edit ? "#fff" : "#f5f5f5",
                  }}
                />
              </Form.Item>

              <div className={edit ? "" : "hidden"}>
                <Button
                  htmlType="submit"
                  size="large"
                  block
                  disabled={isUpdating}
                  style={{
                    border: "none",
                    backgroundColor: "var(--color-main)",
                    color: "#fff",
                  }}
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-10">
        <hr className="my-6" />
        <h4 className="text-xl font-medium text-text-color mb-4 flex items-center gap-2">
          <Lock size={20} />
          Change Password
        </h4>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBgContainer: "#fff",
                colorText: "#333",
                colorTextPlaceholder: "#999",
              },
              Form: {
                labelColor: "#333",
              },
            },
          }}
        >
          <Form
            form={passwordForm}
            onFinish={handleChangePassword}
            layout="vertical"
            className="max-w-md"
          >
            {/* Old Password */}
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[
                { required: true, message: "Please enter your current password" },
              ]}
            >
              <div className="relative">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  size="large"
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Item>

            {/* New Password */}
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  size="large"
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  size="large"
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Item>

            <Button
              htmlType="submit"
              size="large"
              disabled={isChangingPassword}
              style={{
                border: "none",
                backgroundColor: "var(--color-main)",
                color: "#fff",
                width: "200px",
              }}
            >
              {isChangingPassword ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Changing...
                </span>
              ) : (
                "Change Password"
              )}
            </Button>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default PersonalInformationContainer;
