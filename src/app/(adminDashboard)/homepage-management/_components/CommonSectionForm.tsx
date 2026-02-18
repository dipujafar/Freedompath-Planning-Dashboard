"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useUpdateServiceSectionMutation } from "@/redux/api/homePageApi";

// Define the validation schema
const formSchema = z.object({
    tag: z.string().min(1, "Tag is required"),
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().min(1, "Subtitle is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CommonSectionFormProps {
    sectionName: string;
}

export default function CommonSectionForm({ sectionName }: CommonSectionFormProps) {
    const [updateServiceSection, { isLoading }] = useUpdateServiceSectionMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tag: "",
            title: "",
            subTitle: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            if (sectionName === "Service Section") {
                await updateServiceSection(values).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else {
                // Placeholder for other sections
                toast.info(`${sectionName} API not implemented yet`);
                console.log(`${sectionName} Values:`, values);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to update ${sectionName}`);
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tag Field */}
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Tag"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Title Field */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Title"
                                            {...field}
                                            className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Subtitle Field */}
                    <FormField
                        control={form.control}
                        name="subTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter Subtitle"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] min-h-[100px]"
                                    />
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
