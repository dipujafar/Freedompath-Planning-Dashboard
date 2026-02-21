"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import { useRouter } from "next/navigation";
import { useCreateBlogMutation } from "@/redux/api/blogsApi";
import { toast } from "sonner";
import { sanitizeAllHTML } from "@/utils/sanitizeHTML";

const blogSchema = z.object({
    title: z
        .string()
        .min(1, "Blog title is required")
        .max(100, "Blog title must be less than 100 characters"),
    subTitle: z
        .string()
        .max(200, "Subtitle must be less than 200 characters")
        .optional()
        .or(z.literal("")),
    details: z
        .string()
        .min(1, "Blog details are required")
        .max(10000, "Blog details must be less than 10000 characters"),
    isVisible: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const AddBlogForm = () => {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [createBlog, { isLoading }] = useCreateBlogMutation();

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            subTitle: "",
            details: "",
            isVisible: true,
        },
    });

    const onSubmit = async (data: BlogFormValues) => {
        const formData = new FormData();

        const jsonData = {
            title: data.title,
            subTitle: data.subTitle,
            details: sanitizeAllHTML(data.details),
            isVisible: data.isVisible,
        };

        formData.append("data", JSON.stringify(jsonData));

        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const result = await createBlog(formData).unwrap();

            if (result.success) {
                toast.success("Blog created successfully!");
                form.reset();
                setImageFile(null);
                router.push("/blog-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create blog");
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
                <h1 className="text-xl font-semibold">Add New Blog</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter blog title"
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
                        name="subTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Subtitle <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter blog subtitle"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Blog Cover Image</FormLabel>
                        <FileUpload
                            onFileChange={(file) => setImageFile(file as File)}
                        />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Content</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Write blog content here..."
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#E1E1E1] bg-[#F9FAFB] p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Visibility</FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Make this blog visible to the public
                                    </p>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
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
                            "Publish Blog"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddBlogForm;
