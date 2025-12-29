"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import RichTextEditor from "@/components/shared/RichTextEditor";
import { useRouter, useParams } from "next/navigation";
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import {
    useGetSingleAssociateQuery,
    useUpdateAssociateMutation,
} from "@/redux/api/associatesApi";
import { toast } from "sonner";
import { Spin } from "antd";

const formSchema = z.object({
    name: z.string().min(1, "Associate name is required"),
    photo: z.any().optional(),
    bio: z.string().min(1, "Bio is required"),
});

type FormValues = z.infer<typeof formSchema>;

const EditAssociatePage = () => {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const associateId = params.id as string;

    const { data: associateData, isLoading: isLoadingAssociate } =
        useGetSingleAssociateQuery(associateId, {
            skip: !associateId,
        });

    const [updateAssociate, { isLoading: isUpdating }] = useUpdateAssociateMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            photo: undefined,
            bio: "",
        },
    });

    // Populate form with existing data
    useEffect(() => {
        if (associateData?.data) {
            const associate = associateData.data;
            form.setValue("name", associate.name);
            form.setValue("bio", associate.bio);
            if (associate.photo) {
                setExistingPhoto(associate.photo);
            }
        }
    }, [associateData, form]);

    const handlePhotoChange = (file: File | undefined) => {
        if (file) {
            setPhotoFile(file);
            form.setValue("photo", file);
            setExistingPhoto(null); // Clear existing photo preview when new file selected
        } else {
            setPhotoFile(null);
            form.setValue("photo", undefined);
        }
    };

    async function onSubmit(values: FormValues) {
        const formData = new FormData();

        // Build data object - include photo URL if no new file uploaded
        const data: { name: string; bio: string; photo?: string } = {
            name: values.name,
            bio: values.bio,
        };

        // If no new photo file, include the existing photo URL in data
        if (!photoFile && existingPhoto) {
            data.photo = existingPhoto;
        }

        formData.append("data", JSON.stringify(data));

        // If new photo file uploaded, append it
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        try {
            const result = await updateAssociate({
                id: associateId,
                formData,
            }).unwrap();

            if (result.success) {
                toast.success("Associate updated successfully!");
                router.push("/associates-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update associate");
        }
    }

    if (isLoadingAssociate) {
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
                <h1 className="text-xl font-semibold">Edit Associate</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Associate Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter name"
                                        {...field}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel className="font-medium">Associate Photo</FormLabel>
                        {existingPhoto && !photoFile && (
                            <div className="mb-4 mt-2">
                                <p className="text-sm text-muted-foreground mb-2">Current Photo:</p>
                                <img
                                    src={existingPhoto}
                                    alt="Current associate photo"
                                    className="w-32 h-32 object-cover rounded-lg border border-border-color"
                                />
                            </div>
                        )}
                        <FileUpload onFileChange={(file) => handlePhotoChange(file as File)} />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty to keep current photo
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Bio</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Enter associate bio..."
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
                        className="w-full bg-main-color py-5 hover:bg-secondary-color hover:text-black text-white"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Associate"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditAssociatePage;
