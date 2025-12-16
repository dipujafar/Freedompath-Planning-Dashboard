"use client";
import { Button, ConfigProvider, Form, Input } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import profile from "@/assets/image/adminProfile.png";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2, X } from "lucide-react";

const PersonalInformationContainer = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const [fileName, setFileName] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // @ts-expect-error: Ignoring TypeScript error due to inferred 'any' type for 'values' which is handled in the form submit logic
  const handleSubmit = (values) => {
    toast.success("Successfully Change personal information", {
      duration: 1000,
    });
    setEdit(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;

    const file = input.files?.[0];
    console.log(file);

    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url);
      setImageUrl(url);
      setFileName(file);
    } else {
      setImageUrl(null);
      setFileName(null);
    }

    input.value = "";
  };

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
      </div>
      <hr className="my-4" />

      {/* personal information */}
      <div className="mt-10 flex justify-center flex-col xl:flex-row items-center  gap-10">
        <div className="bg-[#fff] h-[365px] md:w-[350px] rounded-xl border border-main-color flex justify-center items-center  text-text-color">
          <div className="space-y-1 relative">
            <div className="relative group">
              <Image
                src={imageUrl || profile}
                alt="adminProfile"
                width={1200}
                height={1200}
                className="size-36 rounded-full flex justify-center items-center"
              ></Image>

              {/* cancel button */}
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
              {/* upload image */}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {/* upload button */}
              <label
                htmlFor="fileInput"
                className="flex cursor-pointer flex-col items-center"
              >
                <div className="bg-white text-black text-lg p-1 rounded-full  absolute bottom-0 right-3">
                  <Camera size={20} />
                </div>
              </label>
            </div>
            <h3 className="text-2xl text-center">Admin</h3>
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
                  colorTextPlaceholder: "#fff",
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
              initialValues={{
                name: "James Tracy",
                email: "enrique@gmail.com",
                phone: "3000597212",
              }}
            >
              {/*  input  name */}
              <Form.Item label="Name" name="name">
                {edit ? (
                  <Input size="large" placeholder="Enter full name "></Input>
                ) : (
                  <Input
                    size="large"
                    placeholder="Enter full name "
                    readOnly
                  ></Input>
                )}
              </Form.Item>

              {/*  input  email */}
              <Form.Item label="Email" name="email">
                {edit ? (
                  <Input size="large" placeholder="Enter email "></Input>
                ) : (
                  <Input
                    size="large"
                    placeholder="Enter email"
                    readOnly
                  ></Input>
                )}
              </Form.Item>

              {/* input  phone number  */}
              <Form.Item label="Phone Number" name="phone">
                {edit ? (
                  <Input size="large" placeholder="Enter Phone number"></Input>
                ) : (
                  <Input
                    size="large"
                    placeholder="Enter Phone number"
                    readOnly
                  ></Input>
                )}
              </Form.Item>

              <div className={edit ? "" : "hidden"}>
                <Button
                  htmlType="submit"
                  size="large"
                  block
                  style={{ border: "none" }}
                >
                  Save Change
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationContainer;
