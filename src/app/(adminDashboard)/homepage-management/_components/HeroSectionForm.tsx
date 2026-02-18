"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Plus, Trash2, Loader2 } from "lucide-react";
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
import {
    useAddHeroButtonMutation,
    useDeleteHeroButtonMutation,
    useGetHeroSectionQuery,
    useUpdateHeroButtonMutation,
    useUpdateHeroSectionMutation
} from "@/redux/api/homePageApi";


// Define the validation schema
const formSchema = z.object({
    tag: z.string().min(1, "Tag is required"),
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    description: z.string().min(1, "Description is required"),
    buttons: z
        .array(
            z.object({
                _id: z.string().optional(),
                title: z.string().min(1, "Button title is required"),
                hyperlink: z.string().min(1, "Hyperlink is required"),
            })
        )
        .optional(),
    heroImage: z.any().optional(),
    floatingCardTitle: z.string().min(1, "Floating card title is required"),
    floatingCardDescription: z.string().min(1, "Floating card description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function HeroSectionForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deletedButtonIds, setDeletedButtonIds] = useState<string[]>([]);

    // API Hooks
    const { data: heroData } = useGetHeroSectionQuery();
    const [updateHeroSection, { isLoading: isUpdatingHero }] = useUpdateHeroSectionMutation();
    const [addHeroButton] = useAddHeroButtonMutation();
    const [updateHeroButton] = useUpdateHeroButtonMutation();
    const [deleteHeroButton] = useDeleteHeroButtonMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tag: "",
            title: "",
            subtitle: "",
            description: "",
            buttons: [{ title: "", hyperlink: "" }],
            floatingCardTitle: "",
            floatingCardDescription: "",
        },
    });

    // Populate form with existing data
    React.useEffect(() => {
        if (heroData?.data) {
            const { tag, title, subtitle, description, buttons, floatingCardTitle, floatingCardShortDescription, heroImage } = heroData.data;
            form.reset({
                tag: tag || "",
                title: title || "",
                subtitle: subtitle || "",
                description: description || "",
                buttons: buttons?.length > 0 ? buttons.map((b: any) => ({
                    _id: b._id,
                    title: b.title,
                    hyperlink: b.link || b.hyperlink || "" // Handle potential field name variance
                })) : [{ title: "", hyperlink: "" }],
                floatingCardTitle: floatingCardTitle || "",
                floatingCardDescription: floatingCardShortDescription || "",
            });
            if (heroImage) {
                setPreviewUrl(heroImage);
            }
        }
    }, [heroData, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "buttons",
    });

    const handleRemoveButton = (index: number) => {
        const button = fields[index];
        if (button._id) {
            setDeletedButtonIds(prev => [...prev, button._id!]);
        }
        remove(index);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            form.setValue("heroImage", file);

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
            form.setValue("heroImage", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();

        // 1. Prepare Hero Section Main Data (Removing buttons as per requirement)
        const heroDataPayload = {
            key: "main",
            tag: values.tag,
            title: values.title,
            subtitle: values.subtitle,
            description: values.description,
            floatingCardTitle: values.floatingCardTitle,
            floatingCardShortDescription: values.floatingCardDescription,
        };

        formData.append("data", JSON.stringify(heroDataPayload));

        if (selectedFile) {
            formData.append("heroImg", selectedFile);
        }

        try {
            // 2. Handle Deletions
            const deletionPromises = deletedButtonIds.map(id => deleteHeroButton(id).unwrap());

            // 3. Handle Additions and Updates
            const buttonPromises = (values.buttons || []).map((btn, index) => {
                const btnData = {
                    key: `button_${index + 1}`,
                    index: index + 1,
                    title: btn.title,
                    link: btn.hyperlink
                };

                if (btn._id) {
                    // Update existing button
                    return updateHeroButton({ id: btn._id, data: btnData }).unwrap();
                } else if (btn.title && btn.hyperlink) {
                    // Add new button
                    return addHeroButton(btnData).unwrap();
                }
                return Promise.resolve();
            });

            // 4. Update Main Hero Section
            await Promise.all([
                ...deletionPromises,
                ...buttonPromises,
                updateHeroSection(formData).unwrap()
            ]);

            setDeletedButtonIds([]); // Reset deletions on success
            toast.success("Hero section and buttons updated successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update hero section");
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
                        name="subtitle"
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

                    {/* Description Field */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter Description"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] min-h-[100px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hero Image Upload */}
                    <FormField
                        control={form.control}
                        name="heroImage"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Hero Image</FormLabel>
                                <FormControl>
                                    <div
                                        className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E1E1E1] bg-[#F9FAFB] transition-colors hover:bg-muted/50"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById("hero-image-upload")?.click()}
                                    >
                                        {previewUrl ? (
                                            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Hero Preview"
                                                    className="max-h-[300px] w-auto rounded-lg object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-8">
                                                <div className="rounded-full bg-primary/10 p-3">
                                                    <Upload className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">Upload Hero Image</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Drag and drop or browse to choose a file
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            id="hero-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Buttons Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel className="text-base font-semibold">Buttons</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ title: "", hyperlink: "" })}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Button
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-[#F9FAFB]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                    <FormField
                                        control={form.control}
                                        name={`buttons.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Button Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Get Started" {...field} className="bg-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`buttons.${index}.hyperlink`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hyperlink</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} className="bg-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
                                    onClick={() => handleRemoveButton(index)}
                                    disabled={fields.length === 1 && index === 0}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Floating Card Details</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Floating Card Title */}
                            <FormField
                                control={form.control}
                                name="floatingCardTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Floating Card Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Floating Card Title"
                                                {...field}
                                                className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Floating Card Description */}
                            <FormField
                                control={form.control}
                                name="floatingCardDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Floating Card Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter Short Description"
                                                {...field}
                                                className="border border-[#E1E1E1] bg-[#F9FAFB] min-h-[80px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdatingHero}
                        className="w-full bg-main-color text-white hover:bg-main-color/90 py-6 text-lg font-medium"
                    >
                        {isUpdatingHero ? (
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
