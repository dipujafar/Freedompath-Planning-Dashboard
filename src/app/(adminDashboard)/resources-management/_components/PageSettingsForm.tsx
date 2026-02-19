"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2, X } from "lucide-react";
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
import { toast } from "sonner";
import { useGetResourcesPageQuery, useUpdateResourcesPageMutation } from "@/redux/api/homePageApi";
import { Spin } from "antd";

// Define the validation schema
const formSchema = z.object({
    title: z.string().min(1, "Page Title is required"),
    description: z.string().min(1, "Page Description is required"),
    gradientText: z.string().min(1, "Gradient text is required"),
    leftSideTitle: z.string().optional().or(z.literal("")).nullable(),
    leftSideSubTitle: z.string().optional().or(z.literal("")).nullable(),
    pageImage: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PageSettingsFormProps {
    pageName: string;
}

export default function PageSettingsForm({ pageName }: PageSettingsFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch data using the hook
    const { data: pageData, isLoading: isFetching } = useGetResourcesPageQuery();
    const [updateResourcesPage, { isLoading: isUpdating }] = useUpdateResourcesPageMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            gradientText: "",
            leftSideTitle: "",
            leftSideSubTitle: "",
        },
    });

    // Populate form with fetched data
    useEffect(() => {
        if (pageData?.data) {
            const { title, description, gradientText, image, leftSideTitle, leftSideSubTitle } = pageData.data;
            form.setValue("title", title || "");
            form.setValue("description", description || "");
            form.setValue("gradientText", gradientText || "");
            form.setValue("leftSideTitle", leftSideTitle || "");
            form.setValue("leftSideSubTitle", leftSideSubTitle || "");
            if (image) {
                setPreviewUrl(image);
            }
        }
    }, [pageData, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            form.setValue("pageImage", file);

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
            form.setValue("pageImage", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        form.setValue("pageImage", null);
        // If needed, clear value of file input via ref, but simplified here
    };

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();

        const jsonData = {
            gradientText: values.gradientText,
            title: values.title,
            description: values.description,
            leftSideTitle: values.leftSideTitle,
            leftSideSubTitle: values.leftSideSubTitle,
        };

        formData.append("data", JSON.stringify(jsonData));

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            await updateResourcesPage(formData).unwrap();
            toast.success(`${pageName} settings updated successfully!`);
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to update ${pageName} settings`);
            console.error(error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

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
                                    <FormLabel>{pageName} Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`Enter ${pageName} Title`}
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
                                    <FormLabel>{pageName} Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`Enter ${pageName} Description`}
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
                        {/* Gradient Text Part */}
                        <FormField
                            control={form.control}
                            name="gradientText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Heading Gradient Text</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Resources"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Left Side Title */}
                        <FormField
                            control={form.control}
                            name="leftSideTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Left Side Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Left Side Title"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {/* Left Side SubTitle */}
                        <FormField
                            control={form.control}
                            name="leftSideSubTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Left Side Subtitle</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Left Side Subtitle"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Page Image Upload */}
                    <FormField
                        control={form.control}
                        name="pageImage"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>{pageName} Image</FormLabel>
                                <FormControl>
                                    <div
                                        className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E1E1E1] bg-[#F9FAFB] transition-colors hover:bg-muted/50"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById("page-image-upload")?.click()}
                                    >
                                        {previewUrl ? (
                                            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Page Preview"
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
                                                    <p className="font-medium">Upload {pageName} Image</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Drag and drop or browse to choose a file
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            id="page-image-upload"
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
