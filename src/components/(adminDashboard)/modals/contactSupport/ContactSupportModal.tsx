"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "antd";
import { RiCloseLargeLine } from "react-icons/ri";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

const ContactSupportModal = ({ open, setOpen }: TPropsType) => {
  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        maxWidth: "600px",
        width: "90%",
        borderRadius: "16px",
      }}
    >
      <div className="p-2">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <div
            className="w-10 h-10 bg-[#F6BEBF]  rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <RiCloseLargeLine size={18} color="#E12728" className="" />
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-3">
          <label className="block text-sm text-gray-500 mb-2">Name</label>
          <div className="text-base text-gray-900">Caleb Shirtum</div>
        </div>

        {/* Email Address Field */}
        <div className="mb-3">
          <label className="block text-sm text-gray-500 mb-2">
            Email Address
          </label>
          <div className="text-base text-gray-900">calebshirtum@gmail.com</div>
        </div>

        {/* Message Section */}
        <div className="mb-2">
          <label className="block text-sm text-gray-500 mb-2">Message</label>
          <div className="text-base text-gray-900 leading-relaxed">
            Dear Admin,
            <br />I hope you're doing well. I am reaching out regarding an issue
            I encountered while posting a job on the platform.
          </div>
        </div>

        {/* Add Reply Textarea */}
        <div className="mb-6">
          <Textarea
            placeholder="Add reply"
            className="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button className="w-full bg-[#8B1F1F] hover:bg-[#6B1515] text-white font-medium py-6 rounded-lg transition-colors">
          SUBMIT
        </Button>
      </div>
    </Modal>
  );
};

export default ContactSupportModal;
