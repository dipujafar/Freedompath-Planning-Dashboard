"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useEffect } from "react";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
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
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
    useGetSingleBookResourceQuery,
    useUpdateBookResourceMutation,
} from "@/redux/api/bookResourcesApi";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Spin } from "antd";

const bookSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Book name is required" })
        .max(100, { message: "Book name must be less than 100 characters" }),
    details: z
        .string()
        .trim()
        .min(1, { message: "Resource details are required" })
        .max(500, { message: "Resource details must be less than 500 characters" }),
});

type BookFormValues = z.infer<typeof bookSchema>;

const EditBookResourcePage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const resourceId = params.id as string;

    const { data: resourceData, isLoading: isFetching } =
        useGetSingleBookResourceQuery(resourceId, {
            skip: !resourceId,
        });

    const [updateBookResource, { isLoading: isUpdating }] =
        useUpdateBookResourceMutation();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            name: "",
            details: "",
        },
    });

    // Populate form with existing data
    useEffect(() => {
        if (resourceData?.data) {
            const resource = resourceData.data;
            form.setValue("name", resource.name);
            form.setValue("details", resource.details);
            if (resource.image) {
                setExistingImage(resource.image);
            }
            if (resource.file) {
                setExistingFile(resource.file);
            }
        }
    }, [resourceData, form]);

    const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setImage(droppedFile);
            setImagePreview(URL.createObjectURL(droppedFile));
            setExistingImage(null);
        }
    }, []);

    const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setExistingFile(null);
        }
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setExistingImage(null);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setExistingFile(null);
        }
    };

    const removeNewImage = () => {
        setImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const removeNewFile = () => {
        setFile(null);
    };

    const onSubmit = async (data: BookFormValues) => {
        const formData = new FormData();

        const jsonData: { name: string; details: string; image?: string; file?: string } = {
            name: data.name,
            details: data.details,
        };

        // Include existing URLs if no new files uploaded
        if (!image && existingImage) {
            jsonData.image = existingImage;
        }
        if (!file && existingFile) {
            jsonData.file = existingFile;
        }

        formData.append("data", JSON.stringify(jsonData));

        if (image) {
            formData.append("image", image);
        }

        if (file) {
            formData.append("file", file);
        }

        try {
            const result = await updateBookResource({
                id: resourceId,
                formData,
            }).unwrap();

            if (result.success) {
                toast.success("Book resource updated successfully!");
                router.push("/resources-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update book resource");
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background border border-border-color rounded-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Edit Book Resource</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Book Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter book name"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Resource Details</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Enter resource details"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <label className="font-medium">Book Cover Image</label>
                        {existingImage && !imagePreview && (
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Current Image:
                                </p>
                                <img
                                    src={existingImage}
                                    alt="Current book cover"
                                    className="max-h-32 rounded-lg border border-border-color object-contain"
                                />
                            </div>
                        )}
                        {imagePreview ? (
                            <div className="relative border border-border rounded-lg p-4">
                                <button
                                    type="button"
                                    onClick={removeNewImage}
                                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 mx-auto rounded-md object-contain"
                                />
                                <p className="text-sm text-muted-foreground text-center mt-2">
                                    {image?.name}
                                </p>
                            </div>
                        ) : (
                            <div
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById("image-input")?.click()}
                                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-[#F9FAFB] border-[#E1E1E1]"
                            >
                                <input
                                    id="image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                                <p className="font-medium text-foreground">Upload new image</p>
                                <p className="text-sm text-muted-foreground">
                                    Leave empty to keep current image
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium">PDF File</label>
                        {existingFile && !file && (
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Current File:
                                </p>
                                <a
                                    href={existingFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View Current PDF
                                </a>
                            </div>
                        )}
                        {file ? (
                            <div className="relative border border-border rounded-lg p-4">
                                <button
                                    type="button"
                                    onClick={removeNewFile}
                                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <Upload className="text-primary" />
                                    <p className="text-sm text-foreground truncate">{file.name}</p>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDrop={handleFileDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById("file-input")?.click()}
                                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-[#F9FAFB] border-[#E1E1E1]"
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                                <p className="font-medium text-foreground">Upload new PDF</p>
                                <p className="text-sm text-muted-foreground">
                                    Leave empty to keep current file
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full mt-6 bg-main-color hover:bg-secondary-color hover:text-black py-5"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Resource"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditBookResourcePage;
