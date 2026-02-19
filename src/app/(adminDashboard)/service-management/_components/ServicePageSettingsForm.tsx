"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2 } from "lucide-react";
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
import { useGetServiceSectionQuery, useUpdateServicePageSettingsMutation } from "@/redux/api/homePageApi";

// Define the validation schema
const formSchema = z.object({
    title: z.string().min(1, "Service Page Title is required"),
    description: z.string().min(1, "Service Page Description is required"),
    normalText: z.string().min(1, "Normal text part is required"),
    gradientText: z.string().min(1, "Gradient text part is required"),
    servicePageImage: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ServicePageSettingsForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { data: servicePageData } = useGetServiceSectionQuery();
    const [updateServicePageSettings, { isLoading }] = useUpdateServicePageSettingsMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            normalText: "",
            gradientText: "",
        },
    });

    React.useEffect(() => {
        if (servicePageData?.data) {
            const { servicePageTitle, servicePageDescription, servicePageNormalText, servicePageGradientText, servicePageImg } = servicePageData.data;
            form.setValue("title", servicePageTitle || "");
            form.setValue("description", servicePageDescription || "");
            form.setValue("normalText", servicePageNormalText || "");
            form.setValue("gradientText", servicePageGradientText || "");
            if (servicePageImg) {
                setPreviewUrl(servicePageImg);
            }
        }
    }, [servicePageData, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            form.setValue("servicePageImage", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            form.setValue("servicePageImage", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();

        const data = {
            servicePageTitle: values.title,
            servicePageDescription: values.description,
            servicePageGradientText: values.gradientText,
            servicePageNormalText: values.normalText,
        };

        formData.append("data", JSON.stringify(data));

        if (selectedFile) {
            formData.append("servicePageImg", selectedFile);
        }

        try {
            await updateServicePageSettings(formData).unwrap();
            toast.success("Service page settings updated successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update service page settings");
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Field */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Page Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Service Page Title"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Page Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Service Page Description"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Normal Text Part */}
                        <FormField
                            control={form.control}
                            name="normalText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Heading Normal Text</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. We Provide Best"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Gradient Text Part */}
                        <FormField
                            control={form.control}
                            name="gradientText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Heading Gradient Text</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Services"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Service Page Image Upload */}
                    <FormField
                        control={form.control}
                        name="servicePageImage"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Service Page Image</FormLabel>
                                <FormControl>
                                    <div
                                        className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E1E1E1] bg-[#F9FAFB] transition-colors hover:bg-muted/50"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById("service-page-image-upload")?.click()}
                                    >
                                        {previewUrl ? (
                                            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Service Page Preview"
                                                    className="max-h-[300px] w-auto rounded-lg object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-8">
                                                <div className="rounded-full bg-primary/10 p-3">
                                                    <Upload className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">Upload Service Page Image</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Drag and drop or browse to choose a file
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            id="service-page-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-main-color text-white hover:bg-main-color/90 py-6 text-lg font-medium"
                    >
                        {isLoading ? (
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
