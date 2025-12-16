"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "antd";
import { X, User, FileText, Download } from "lucide-react";
import { RiCloseLargeLine } from "react-icons/ri";

type DocumentType = {
  id: string;
  name: string;
  filename: string;
  uploadedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  fileUrl: string;
};

type ClaimantInfo = {
  gymName: string;
  fullName: string;
  state: string;
  email: string;
  city: string;
  phone: string;
  claimDate: string;
};

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  claimantInfo?: ClaimantInfo;
  documents?: DocumentType[];
};

const GymRequestModal = ({
  open,
  setOpen,
  claimantInfo = {
    gymName: "The Arena Combat Academy",
    fullName: "Marcus Silva",
    state: "CA",
    email: "marcus.silva@gmail.com",
    city: "Los Angeles",
    phone: "(555) 123-4567",
    claimDate: "12/10/2025",
  },
  documents = [
    {
      id: "1",
      name: "Utility Bill",
      filename: "utility_bill_dec2024.pdf",
      uploadedDate: "1/14/2024",
      status: "Pending",
      fileUrl: "/documents/utility_bill.pdf",
    },
    {
      id: "2",
      name: "Business License",
      filename: "business_license_elite_bjj.pdf",
      uploadedDate: "1/14/2024",
      status: "Pending",
      fileUrl: "/documents/business_license.pdf",
    },
    {
      id: "3",
      name: "Tax Document",
      filename: "tax_return_2023.pdf",
      uploadedDate: "1/14/2024",
      status: "Pending",
      fileUrl: "/documents/tax_return.pdf",
    },
  ],
}: TPropsType) => {
  const handleDownload = (fileUrl: string, filename: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        maxWidth: "480px",
        width: "90%",
        borderRadius: "12px",
      }}
    >
      <div>
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <div
            className="w-10 h-10 bg-[#F6BEBF]  rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <RiCloseLargeLine size={18} color="#E12728" className="" />
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gym Claim Request Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review the gym claim request and verify the claimant's information
              and documents.
            </p>
          </div>
        </div>

        {/* Claimant Information Section */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Claimant Information
            </h3>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold text-gray-900">
                Gym Name :{" "}
              </span>
              <span className="text-sm text-gray-700">
                {claimantInfo.gymName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Full Name:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.fullName}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  State:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.state}
                </span>
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Email:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.email}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  City:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.city}
                </span>
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Phone:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.phone}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Claim Date:{" "}
                </span>
                <span className="text-sm text-gray-700">
                  {claimantInfo.claimDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Required Documents
            </h3>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText size={20} className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.filename}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Uploaded: {doc.uploadedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => handleDownload(doc.fileUrl, doc.filename)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Download size={14} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            size={"sm"}
            className="flex-1 bg-[#00A63E] hover:bg-green-700 text-white font-medium py-5 rounded-lg transition-colors"
            onClick={() => console.log("Claim approved")}
          >
            ✓ Approve Claim
          </Button>
          <Button
            size={"sm"}
            className="flex-1 bg-[#D4183D] hover:bg-red-700 text-white font-medium py-5 rounded-lg transition-colors"
            onClick={() => console.log("Claim rejected")}
          >
            ✕ Reject Claim
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GymRequestModal;
