"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import {
    useUpdateServiceSectionMutation,
    useUpdateBlogSectionMutation,
    useUpdateResourceSectionMutation,
    useUpdateLearnAndGrowSectionMutation,
    useUpdateTestimonialSectionMutation,
    useGetServiceSectionQuery,
    useGetBlogSectionQuery,
    useGetResourceSectionQuery,
    useGetLearnAndGrowSectionQuery,
    useGetTestimonialSectionQuery,
} from "@/redux/api/homePageApi";

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
    const [updateServiceSection] = useUpdateServiceSectionMutation();
    const [updateBlogSection] = useUpdateBlogSectionMutation();
    const [updateResourceSection] = useUpdateResourceSectionMutation();
    const [updateLearnAndGrowSection] = useUpdateLearnAndGrowSectionMutation();
    const [updateTestimonialSection] = useUpdateTestimonialSectionMutation();

    // Fetch all sections (RTK Query won't fire unless the hook is actually used)
    const { data: serviceSectionData } = useGetServiceSectionQuery(undefined, { skip: sectionName !== "Service Section" });
    const { data: blogSectionData } = useGetBlogSectionQuery(undefined, { skip: sectionName !== "Blog Section" });
    const { data: resourceSectionData } = useGetResourceSectionQuery(undefined, { skip: sectionName !== "Resource Section" });
    const { data: learnAndGrowSectionData } = useGetLearnAndGrowSectionQuery(undefined, { skip: sectionName !== "Book Section" });
    const { data: testimonialSectionData } = useGetTestimonialSectionQuery(undefined, { skip: sectionName !== "Testimonial Section" });

    // Determine loading state
    const [isUpdating, setIsUpdating] = useState(false);

    // Testimonial section visibility toggles (design only)
    const [showOnHomePage, setShowOnHomePage] = useState(false);
    const [showOnAboutUs, setShowOnAboutUs] = useState(false);
    const [showOnServices, setShowOnServices] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tag: "",
            title: "",
            subTitle: "",
        },
    });

    // Populate form based on active section
    React.useEffect(() => {
        const dataMap: Record<string, any> = {
            "Service Section": serviceSectionData?.data,
            "Blog Section": blogSectionData?.data,
            "Resource Section": resourceSectionData?.data,
            "Book Section": learnAndGrowSectionData?.data,
            "Testimonial Section": testimonialSectionData?.data,
        };

        const sectionData = dataMap[sectionName];
        if (sectionData) {
            form.reset({
                tag: sectionData.tag || "",
                title: sectionData.title || "",
                subTitle: sectionData.subTitle || "",
            });

            // Pre-populate visibility toggles for Testimonial Section
            if (sectionName === "Testimonial Section") {
                setShowOnHomePage(sectionData.homePageVisible ?? false);
                setShowOnAboutUs(sectionData.aboutPageVisible ?? false);
                setShowOnServices(sectionData.servicePageVisible ?? false);
            }
        }
    }, [
        sectionName,
        serviceSectionData,
        blogSectionData,
        resourceSectionData,
        learnAndGrowSectionData,
        testimonialSectionData,
        form,
    ]);

    const onSubmit = async (values: FormValues) => {
        setIsUpdating(true);
        const payload = {
            key: "main",
            ...values
        };

        try {
            if (sectionName === "Service Section") {
                await updateServiceSection(payload).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else if (sectionName === "Blog Section") {
                await updateBlogSection(payload).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else if (sectionName === "Resource Section") {
                await updateResourceSection(payload).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else if (sectionName === "Book Section") {
                await updateLearnAndGrowSection(payload).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else if (sectionName === "Testimonial Section") {
                const testimonialPayload = {
                    ...payload,
                    homePageVisible: showOnHomePage,
                    aboutPageVisible: showOnAboutUs,
                    servicePageVisible: showOnServices,
                };
                await updateTestimonialSection(testimonialPayload).unwrap();
                toast.success(`${sectionName} updated successfully!`);
            } else {
                toast.info(`${sectionName} API not implemented yet`);
                console.log(`${sectionName} Values:`, values);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to update ${sectionName}`);
            console.error(error);
        } finally {
            setIsUpdating(false);
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

                    {/* Testimonial Visibility Toggles */}
                    {sectionName === "Testimonial Section" && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-gray-700">Page Visibility</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Control which pages display the Testimonial section.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {/* Home Page */}
                                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E1E1E1] bg-[#F9FAFB]">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Show on Home Page</p>
                                        <p className="text-xs text-muted-foreground">Display testimonials on the main landing page</p>
                                    </div>
                                    <Switch
                                        checked={showOnHomePage}
                                        onCheckedChange={setShowOnHomePage}
                                    />
                                </div>

                                {/* About Us Page */}
                                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E1E1E1] bg-[#F9FAFB]">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Show on About Us Page</p>
                                        <p className="text-xs text-muted-foreground">Display testimonials on the About Us page</p>
                                    </div>
                                    <Switch
                                        checked={showOnAboutUs}
                                        onCheckedChange={setShowOnAboutUs}
                                    />
                                </div>

                                {/* Services Page */}
                                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E1E1E1] bg-[#F9FAFB]">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Show on Services Page</p>
                                        <p className="text-xs text-muted-foreground">Display testimonials on the Services page</p>
                                    </div>
                                    <Switch
                                        checked={showOnServices}
                                        onCheckedChange={setShowOnServices}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-main-color text-white hover:bg-main-color/90 py-6 text-lg font-medium"
                    >
                        {isUpdating ? (
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
