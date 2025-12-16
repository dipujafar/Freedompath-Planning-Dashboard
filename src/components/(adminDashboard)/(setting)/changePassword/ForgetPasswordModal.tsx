import { Button, ConfigProvider, Form, Input, Modal } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";
import VerifyEmailModal from "./VerifyEmailModal";
import { useState } from "react";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

const ForgetPasswordModal = ({ open, setOpen }: TPropsType) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);

  // @ts-expect-error: Ignoring TypeScript error due to inferred 'any' type for 'values' which is handled in the form submit logic
  const handleSubmit = (values) => {
    console.log("Success:", values);
    setOpen(false);
    setOpenModal(true);
  };
  return (
    <>
      <Modal
        open={open}
        footer={null}
        centered={true}
        onCancel={() => setOpen(false)}
        closeIcon={false}
        style={{
          minWidth: "max-content",
        }}
      >
        <div className="py-14">
          <div
            className="w-12 h-12 bg-main-color  absolute top-2 right-2 rounded-full cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <RiCloseLargeLine
              size={18}
              color="#fff"
              className="absolute top-1/3 left-1/3"
            />
          </div>

          {/* header */}
          <div>
            <h4 className=" text-2xl font-medium text-center">
              Forgot Password
            </h4>
            <p className="mt-1 text-center">
              Please enter your email address to reset your password.
            </p>
          </div>

          {/* form */}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{
              maxWidth: 500,
              marginTop: "25px",
            }}
          >
            {/*  input  email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", required: true }]}
            >
              <Input size="large" placeholder="Enter Your Email "></Input>
            </Form.Item>

            <Button
              htmlType="submit"
              size="large"
              block
              className="!border-none "
            >
              Send OTP
            </Button>
          </Form>
        </div>
      </Modal>
      <VerifyEmailModal
        open={openModal}
        setOpen={setOpenModal}
      ></VerifyEmailModal>
    </>
  );
};

export default ForgetPasswordModal;
