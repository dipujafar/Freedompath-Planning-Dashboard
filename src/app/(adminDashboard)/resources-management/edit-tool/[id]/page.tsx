"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
    useGetSingleToolResourceQuery,
    useUpdateToolResourceMutation,
} from "@/redux/api/toolResourcesApi";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Spin } from "antd";

const resourceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Resource name is required" })
        .max(100, { message: "Resource name must be less than 100 characters" }),
    details: z
        .string()
        .trim()
        .min(1, { message: "Resource details are required" })
        .max(500, { message: "Resource details must be less than 500 characters" }),
    link: z
        .string()
        .trim()
        .min(1, { message: "Resource link is required" })
        .url({ message: "Please enter a valid URL" }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const EditToolResourcePage = () => {
    const router = useRouter();
    const params = useParams();
    const resourceId = params.id as string;

    const { data: resourceData, isLoading: isFetching } =
        useGetSingleToolResourceQuery(resourceId, {
            skip: !resourceId,
        });

    const [updateToolResource, { isLoading: isUpdating }] =
        useUpdateToolResourceMutation();

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            name: "",
            details: "",
            link: "",
        },
    });

    // Populate form with existing data
    useEffect(() => {
        if (resourceData?.data) {
            const resource = resourceData.data;
            form.setValue("name", resource.name);
            form.setValue("details", resource.details);
            form.setValue("link", resource.link);
        }
    }, [resourceData, form]);

    const onSubmit = async (data: ResourceFormValues) => {
        try {
            const result = await updateToolResource({
                id: resourceId,
                body: {
                    name: data.name,
                    details: data.details,
                    link: data.link,
                },
            }).unwrap();

            if (result.success) {
                toast.success("Tool resource updated successfully!");
                router.push("/resources-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update tool resource");
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
                <h1 className="text-xl font-semibold">Edit Tool Resource</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-w-2xl"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Resource Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter resource name"
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
                                    <Textarea
                                        placeholder="Enter resource details"
                                        {...field}
                                        className="min-h-24 resize-y border border-[#E1E1E1] bg-[#F9FAFB]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Resource Link</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full mt-6 py-5 bg-main-color hover:bg-secondary-color hover:text-black"
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

export default EditToolResourcePage;
