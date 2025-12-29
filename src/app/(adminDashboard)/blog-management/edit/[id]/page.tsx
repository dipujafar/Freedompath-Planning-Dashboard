"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import { useRouter, useParams } from "next/navigation";
import {
    useGetSingleBlogQuery,
    useUpdateBlogMutation,
} from "@/redux/api/blogsApi";
import { toast } from "sonner";
import { Spin } from "antd";

const blogSchema = z.object({
    title: z
        .string()
        .min(1, "Blog title is required")
        .max(100, "Blog title must be less than 100 characters"),
    subTitle: z
        .string()
        .min(1, "Subtitle is required")
        .max(200, "Subtitle must be less than 200 characters"),
    details: z
        .string()
        .min(1, "Blog details are required")
        .max(10000, "Blog details must be less than 10000 characters"),
    isVisible: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const EditBlogPage = () => {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id as string;

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    const { data: blogData, isLoading: isFetching } = useGetSingleBlogQuery(
        blogId,
        {
            skip: !blogId,
        }
    );

    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            subTitle: "",
            details: "",
            isVisible: true,
        },
    });

    // Populate form with existing data
    useEffect(() => {
        if (blogData?.data) {
            const blog = blogData.data;
            form.setValue("title", blog.title);
            form.setValue("subTitle", blog.subTitle);
            form.setValue("details", blog.details);
            form.setValue("isVisible", blog.isVisible);
            if (blog.image) {
                setExistingImage(blog.image);
            }
        }
    }, [blogData, form]);

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            setImageFile(file);
            setExistingImage(null);
        }
    };

    const onSubmit = async (data: BlogFormValues) => {
        const formData = new FormData();

        const jsonData: {
            title: string;
            subTitle: string;
            details: string;
            isVisible: boolean;
            image?: string;
        } = {
            title: data.title,
            subTitle: data.subTitle,
            details: data.details,
            isVisible: data.isVisible,
        };

        // Include existing image URL if no new file uploaded
        if (!imageFile && existingImage) {
            jsonData.image = existingImage;
        }

        formData.append("data", JSON.stringify(jsonData));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const result = await updateBlog({
                id: blogId,
                formData,
            }).unwrap();

            if (result.success) {
                toast.success("Blog updated successfully!");
                router.push("/blog-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update blog");
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
                <h1 className="text-xl font-semibold">Edit Blog</h1>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
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
                                <FormLabel>Blog Subtitle</FormLabel>
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
                        {existingImage && !imageFile && (
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Current Image:
                                </p>
                                <img
                                    src={existingImage}
                                    alt="Current blog cover"
                                    className="max-h-40 rounded-lg border border-border-color object-contain"
                                />
                            </div>
                        )}
                        <FileUpload
                            onFileChange={(file) => handleImageChange(file as File)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty to keep current image
                        </p>
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
                        disabled={isUpdating}
                        className="w-full bg-main-color py-5 hover:bg-secondary-color hover:text-black"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Blog"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditBlogPage;
