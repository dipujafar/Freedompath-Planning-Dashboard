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
import { toast } from "sonner";

// Define the validation schema
const formSchema = z.object({
    title: z.string().min(1, "Page Title is required"),
    description: z.string().min(1, "Page Description is required"),
    gradientText: z.string().min(1, "Gradient text is required"),
    pageImage: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PageSettingsFormProps {
    pageName: string;
}

export default function PageSettingsForm({ pageName }: PageSettingsFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            gradientText: "",
        },
    });

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

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true);
        try {
            console.log(`${pageName} Settings Values:`, values);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(`${pageName} settings updated successfully!`);
        } catch (error) {
            toast.error(`Failed to update ${pageName} settings`);
            console.error(error);
        } finally {
            setIsLoading(false);
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

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
