"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useCreateBookMutation } from "@/redux/api/booksApi";
import { toast } from "sonner";
import { sanitizeAllHTML } from "@/utils/sanitizeHTML";

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
    url: z.string().min(1, "Book link is required"),
});

type BookFormValues = z.infer<typeof bookSchema>;

const AddBookForm = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();

    const [createBook, { isLoading }] = useCreateBookMutation();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            name: "",
            price: "",
            details: "",
            url: "",
        },
    });

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
        }
    };

    const removePdfFile = () => {
        setPdfFile(null);
    };

    const onSubmit = async (data: BookFormValues) => {
        const formData = new FormData();

        const jsonData = {
            name: data.name,
            price: Number(data.price),
            details: sanitizeAllHTML(data.details),
            url: data.url,
        };

        formData.append("data", JSON.stringify(jsonData));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (pdfFile) {
            formData.append("file", pdfFile);
        }

        try {
            const result = await createBook(formData).unwrap();

            if (result.success) {
                toast.success("Book created successfully!");
                form.reset();
                setImageFile(null);
                setPdfFile(null);
                router.push("/book-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create book");
        }
    };

    return (
        <div className="w-full p-2">
            <div className="mb-6 flex items-center gap-3">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Add A New Book</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Link</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter Book Link"
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
                        <FileUpload
                            onFileChange={(file) => setImageFile(file as File)}
                        />
                    </FormItem>

                    <FormItem>
                        <FormLabel>Upload PDF File</FormLabel>
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
                                    <p className="text-sm text-foreground truncate">{pdfFile.name}</p>
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
                                    <p className="font-medium text-foreground">Upload your PDF</p>
                                    <p className="text-sm text-muted-foreground">
                                        Drag and drop or browse to choose a file
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
                        disabled={isLoading}
                        className="w-full bg-main-color py-5 hover:bg-secondary-color hover:text-black"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddBookForm;
