"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
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
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import { useRouter, useParams } from "next/navigation";
import {
    useGetSingleBookQuery,
    useUpdateBookMutation,
} from "@/redux/api/booksApi";
import { toast } from "sonner";
import { Spin } from "antd";

const bookSchema = z.object({
    name: z
        .string()
        .min(1, "Book name is required")
        .max(100, "Book name must be less than 100 characters"),
    price: z
        .string()
        .min(1, "Book price is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Price must be a valid number",
        }),
    details: z
        .string()
        .min(1, "Book details are required")
        .max(5000, "Book details must be less than 5000 characters"),
});

type BookFormValues = z.infer<typeof bookSchema>;

const EditBookPage = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();
    const params = useParams();
    const bookId = params.id as string;

    const { data: bookData, isLoading: isFetching } = useGetSingleBookQuery(
        bookId,
        {
            skip: !bookId,
        }
    );

    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            name: "",
            price: "",
            details: "",
        },
    });

    // Populate form with existing data
    useEffect(() => {
        if (bookData?.data) {
            const book = bookData.data;
            form.setValue("name", book.name);
            form.setValue("price", book.price.toString());
            form.setValue("details", book.details);
            if (book.image) {
                setExistingImage(book.image);
            }
            if (book.file) {
                setExistingFile(book.file);
            }
        }
    }, [bookData, form]);

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setExistingFile(null);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
            setExistingFile(null);
        }
    };

    const removePdfFile = () => {
        setPdfFile(null);
    };

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            setImageFile(file);
            setExistingImage(null);
        }
    };

    const onSubmit = async (data: BookFormValues) => {
        const formData = new FormData();

        const jsonData: {
            name: string;
            price: number;
            details: string;
            image?: string;
            file?: string;
        } = {
            name: data.name,
            price: Number(data.price),
            details: data.details,
        };

        // Include existing URLs if no new files uploaded
        if (!imageFile && existingImage) {
            jsonData.image = existingImage;
        }
        if (!pdfFile && existingFile) {
            jsonData.file = existingFile;
        }

        formData.append("data", JSON.stringify(jsonData));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (pdfFile) {
            formData.append("file", pdfFile);
        }

        try {
            const result = await updateBook({
                id: bookId,
                formData,
            }).unwrap();

            if (result.success) {
                toast.success("Book updated successfully!");
                router.push("/book-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update book");
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
                <h1 className="text-xl font-semibold">Edit Book</h1>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter Book Name"
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
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter Book Price"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Book Cover Image</FormLabel>
                        {existingImage && !imageFile && (
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
                        <FileUpload onFileChange={(file) => handleImageChange(file as File)} />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty to keep current image
                        </p>
                    </FormItem>

                    <FormItem>
                        <FormLabel>PDF File</FormLabel>
                        {existingFile && !pdfFile && (
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
                        {pdfFile ? (
                            <div className="relative border border-border rounded-lg p-4">
                                <button
                                    type="button"
                                    onClick={removePdfFile}
                                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <Upload className="text-primary" />
                                    <p className="text-sm text-foreground truncate">
                                        {pdfFile.name}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-[#F9FAFB] ${isDragging
                                    ? "border-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                onDrop={handleFileDrop}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onClick={() => document.getElementById("pdf-upload")?.click()}
                            >
                                <input
                                    id="pdf-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-color">
                                        <Upload className="size-6 text-primary" />
                                    </div>
                                    <p className="font-medium text-foreground">Upload new PDF</p>
                                    <p className="text-sm text-muted-foreground">
                                        Leave empty to keep current file
                                    </p>
                                </div>
                            </div>
                        )}
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Details</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Write book details here"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-main-color py-5 hover:bg-secondary-color hover:text-black"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Book"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditBookPage;
