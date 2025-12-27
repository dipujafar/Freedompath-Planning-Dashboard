"use client";

import { Button, Spin } from "antd";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
  useGetContentsQuery,
  useUpdateContentsMutation,
} from "@/redux/api/contentsApi";
import { toast } from "sonner";

// Dynamically import ReactQuill with SSR disabled
import RichTextEditor from "@/components/shared/RichTextEditor";

const TermsConditionsEditor = () => {
  const [value, setValue] = useState("");

  const { data: contentsData, isLoading: isFetching } = useGetContentsQuery();
  const [updateContents, { isLoading: isUpdating }] =
    useUpdateContentsMutation();

  // Populate editor with existing data
  useEffect(() => {
    if (contentsData?.data?.termsAndCondition) {
      setValue(contentsData.data.termsAndCondition);
    }
  }, [contentsData]);



  const handleSave = async () => {
    try {
      const result = await updateContents({
        termsAndCondition: value,
      }).unwrap();

      if (result.success) {
        toast.success("Terms & Conditions updated successfully!");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update Terms & Conditions"
      );
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <h4 className="text-2xl font-medium text-text-color">
          Terms & Conditions
        </h4>
      </div>
      <div className="mt-5 border rounded p-2">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Start writing ......"
        />
      </div>

      <Button
        size="large"
        block
        onClick={handleSave}
        disabled={isUpdating}
        style={{
          marginTop: "20px",
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
    </>
  );
};

export default dynamic(() => Promise.resolve(TermsConditionsEditor), {
  ssr: false,
});
