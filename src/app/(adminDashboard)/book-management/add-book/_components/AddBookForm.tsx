'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Upload } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import { useRouter } from "next/navigation";

const bookSchema = z.object({
    bookName: z.string().min(1, "Book name is required").max(100, "Book name must be less than 100 characters"),
    bookPrice: z.string().min(1, "Book price is required"),
    bookLink: z.string().url("Please enter a valid URL").or(z.string().length(0)),
    bookPhoto: z.any().optional(),
    uploadFile: z.any().optional(),
    bookDetails: z.string().max(5000, "Book details must be less than 5000 characters").optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface FileUploadZoneProps {
    label: string;
    value: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    isImage?: boolean;
}

const FileUploadZone = ({ label, value, onChange, accept, isImage }: FileUploadZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) onChange(file);
        },
        [onChange]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-[#F9FAFB] ${isDragging ? "border-primary " : "border-border hover:border-primary/50"
                }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById(label)?.click()}
        >
            <input
                id={label}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                }}
            />
            <div className="flex flex-col items-center gap-2 ">
                <div className="w-12 h-12 rounded-full  flex items-center justify-center bg-secondary-color">
                    <Upload className="size-6 text-blue-500 text-primary" />
                </div>
                <p className="font-medium text-foreground">
                    {value ? value.name : isImage ? "Upload your image" : "Upload your File"}
                </p>
                <p className="text-sm text-muted-foreground">
                    Drag and drop or browse to choose a file
                </p>
            </div>
        </div>
    );
};

const AddBookForm = () => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const router = useRouter();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            bookName: "",
            bookPrice: "",
            bookLink: "",
            bookDetails: "",
        },
    });

    const onSubmit = (data: BookFormValues) => {
        console.log("Form submitted:", { ...data, uploadFile });
    };

    return (
        <div className="w-full p-2">
            <div className="mb-6 flex items-center gap-3">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold"> Add A New Book</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="bookName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Book Name" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bookPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Book Price" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bookLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Book Link" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Book Photo</FormLabel>
                        <FileUpload onFileChange={(file) => form.setValue("bookPhoto", file as File)} />
                    </FormItem>

                    <FormItem>
                        <FormLabel>Upload File</FormLabel>
                        <FileUploadZone
                            label="uploadFile"
                            value={uploadFile}
                            onChange={setUploadFile}
                            accept=".pdf"
                        />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="bookDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Details</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write book details here"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-main-color py-5">
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddBookForm;
