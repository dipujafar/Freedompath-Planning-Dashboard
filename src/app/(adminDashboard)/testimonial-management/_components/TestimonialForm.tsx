"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Upload, Star, Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import {
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
} from "@/redux/api/testimonialsApi";
import { toast } from "sonner";
import { ITestimonial } from "@/types/testimonial.types";

const formSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    designation: z.string().min(1, "Designation is required"),
    clientPhoto: z.any().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    rating: z.number().min(1, "Please select a rating").max(5),
});

type FormValues = z.infer<typeof formSchema>;

interface TestimonialFormProps {
    mode: "create" | "edit";
    testimonialId?: string;
    initialData?: ITestimonial;
}

export function TestimonialForm({
    mode,
    testimonialId,
    initialData,
}: TestimonialFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const router = useRouter();

    const [createTestimonial, { isLoading: isCreating }] =
        useCreateTestimonialMutation();
    const [updateTestimonial, { isLoading: isUpdating }] =
        useUpdateTestimonialMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientName: "",
            designation: "",
            description: "",
            rating: 0,
        },
    });

    // Populate form with initial data for edit mode
    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.setValue("clientName", initialData.clientName);
            form.setValue("designation", initialData.designation);
            form.setValue("description", initialData.description);
            form.setValue("rating", initialData.rating);
            if (initialData.clientPhoto) {
                setExistingPhoto(initialData.clientPhoto);
            }
        }
    }, [mode, initialData, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            form.setValue("clientPhoto", file);
            setExistingPhoto(null);

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
            form.setValue("clientPhoto", file);
            setExistingPhoto(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();

        // Build data object
        const data: {
            clientName: string;
            designation: string;
            description: string;
            rating: number;
            clientPhoto?: string;
        } = {
            clientName: values.clientName,
            designation: values.designation,
            description: values.description,
            rating: values.rating,
        };

        // For edit mode, include existing photo URL if no new file
        if (mode === "edit" && !selectedFile && existingPhoto) {
            data.clientPhoto = existingPhoto;
        }

        formData.append("data", JSON.stringify(data));

        // Append photo file if selected
        if (selectedFile) {
            formData.append("clientPhoto", selectedFile);
        }

        try {
            if (mode === "create") {
                const result = await createTestimonial(formData).unwrap();
                if (result.success) {
                    toast.success("Testimonial created successfully!");
                    router.push("/testimonial-management");
                }
            } else {
                const result = await updateTestimonial({
                    id: testimonialId!,
                    formData,
                }).unwrap();
                if (result.success) {
                    toast.success("Testimonial updated successfully!");
                    router.push("/testimonial-management");
                }
            }
        } catch (error: any) {
            toast.error(
                error?.data?.message ||
                `Failed to ${mode === "create" ? "create" : "update"} testimonial`
            );
        }
    };

    const currentRating = form.watch("rating");

    return (
        <div className="min-h-screen bg-background p-4">
            <div>
                <div className="mb-6 flex items-center gap-3">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">
                        {mode === "create" ? "Add Testimonial" : "Edit Testimonial"}
                    </h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Client Name"
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
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Designation</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Client Designation"
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
                            name="clientPhoto"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Client Photo</FormLabel>
                                    {mode === "edit" && existingPhoto && !previewUrl && (
                                        <div className="mb-4">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Current Photo:
                                            </p>
                                            <img
                                                src={existingPhoto}
                                                alt="Current client photo"
                                                className="w-32 h-32 object-cover rounded-lg border border-border-color"
                                            />
                                        </div>
                                    )}
                                    <FormControl>
                                        <div
                                            className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E1E1E1] bg-[#F9FAFB] transition-colors hover:bg-muted/50"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() =>
                                                document.getElementById("file-upload")?.click()
                                            }
                                        >
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="h-full max-h-[200px] w-auto rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 py-8">
                                                    <div className="rounded-full bg-primary/10 p-3">
                                                        <Upload className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-medium">Upload your image</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Drag and drop or browse to choose a file
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    {mode === "edit" && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Leave empty to keep current photo
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the comment which client says"
                                            className="min-h-[120px] resize-none border border-[#E1E1E1] bg-[#F9FAFB]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Star Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => field.onChange(star)}
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${star <= (hoveredStar || currentRating)
                                                                ? "fill-[#3673DE] text-[#3673DE]"
                                                                : "fill-none text-muted-foreground"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-main-color text-background hover:bg-secondary-color hover:text-black py-5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                </>
                            ) : mode === "create" ? (
                                "Save"
                            ) : (
                                "Update Testimonial"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
