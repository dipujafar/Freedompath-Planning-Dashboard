'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
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

const blogSchema = z.object({
    blogName: z.string().min(1, "Blog name is required").max(100, "Blog name must be less than 100 characters"),
    blogSubtitle: z.string().max(200, "Subtitle must be less than 200 characters").optional(),
    blogPhoto: z.any().optional(),
    blogDetails: z.string().max(10000, "Blog details must be less than 10000 characters").optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const AddBlogForm = () => {
    const router = useRouter();


    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            blogName: "",
            blogSubtitle: "",
            blogDetails: "",
        },
    });

    const onSubmit = (data: BlogFormValues) => {
        console.log("Blog form submitted:", { ...data });
    };

    return (
        <div className="w-full  p-2">
            <div className="mb-6 flex items-center gap-3">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold"> Add New Blog</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="blogName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="blogSubtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Subtitle</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Blog Photo</FormLabel>
                        <FileUpload onFileChange={(file) => form.setValue("blogPhoto", file as File)} />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="blogDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blog Details</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write blog details here"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-main-color py-5">
                        Save Services
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddBlogForm;
