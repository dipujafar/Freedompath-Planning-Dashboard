import { Button, Form, Input, Modal } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { useState } from "react";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

const VerifyEmailModal = ({ open, setOpen }: TPropsType) => {
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
            <h4 className=" text-2xl font-medium text-center">Verify Email</h4>
            <p className="mt-1 text-center">
              Please enter the OTP we have sent you in your email.{" "}
            </p>
          </div>

          {/* form */}
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{
              marginTop: "25px",
            }}
          >
            {/*  input  email */}
            <Form.Item
              name="OTP"
              rules={[{ required: true }]}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Input.OTP size="large" />
            </Form.Item>

            <div className="mb-5 flex justify-between px-12 text-text-color">
              <p>Didn’t receive the code?</p>
              <p className="text-main-color font-medium cursor-pointer">
                Resend
              </p>
            </div>

            <Button
              htmlType="submit"
              size="large"
              block
              className="!border-none "
            >
              Send OPT
            </Button>
          </Form>
        </div>
      </Modal>
      <UpdatePasswordModal
        open={openModal}
        setOpen={setOpenModal}
      ></UpdatePasswordModal>
    </>
  );
};

export default VerifyEmailModal;
