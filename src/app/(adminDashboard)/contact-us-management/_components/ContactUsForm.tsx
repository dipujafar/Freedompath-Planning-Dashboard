"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    useGetContactUsContentQuery,
    useUpdateContactUsContentMutation,
} from "@/redux/api/contactUsApi";
import { Spin } from "antd";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().min(1, "Subtitle is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactUsForm() {
    const { data, isLoading: isFetching } = useGetContactUsContentQuery();
    const [updateContactUsContent, { isLoading: isUpdating }] = useUpdateContactUsContentMutation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", subTitle: "" },
    });

    // Pre-populate from GET
    useEffect(() => {
        if (data?.data) {
            form.setValue("title", data.data.title || "");
            form.setValue("subTitle", data.data.subTitle || "");
            if (data.data.banner) {
                setPreviewUrl(data.data.banner);
            }
        }
    }, [data, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("subTitle", values.subTitle);
        if (selectedFile) {
            formData.append("banner", selectedFile);
        }

        try {
            await updateContactUsContent(formData).unwrap();
            toast.success("Contact Us section updated successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update Contact Us section");
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
        <div className="bg-white p-6 rounded-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter title"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Subtitle */}
                    <FormField
                        control={form.control}
                        name="subTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter subtitle"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] min-h-[100px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Banner Image Upload */}
                    <div className="space-y-2">
                        <FormLabel>Banner Image</FormLabel>
                        <div
                            className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E1E1E1] bg-[#F9FAFB] transition-colors hover:bg-muted/50"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
                                    <img
                                        src={previewUrl}
                                        alt="Banner Preview"
                                        className="max-h-[300px] w-auto rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-md transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-8">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <Upload className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">Upload Banner Image</p>
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop or browse to choose a file
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-main-color text-white hover:bg-main-color/90 py-6 text-lg font-medium"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
