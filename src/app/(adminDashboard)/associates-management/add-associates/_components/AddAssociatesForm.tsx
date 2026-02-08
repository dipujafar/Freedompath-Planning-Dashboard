"use client";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload";
import { useCreateAssociateMutation } from "@/redux/api/associatesApi";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Associate name is required"),
    photo: z.instanceof(File).optional().or(z.string().optional()),
    bio: z.string().min(1, "Bio is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAssociatesForm() {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const router = useRouter();

    const [createAssociate, { isLoading }] = useCreateAssociateMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            photo: undefined,
            bio: "",
        },
    });

    const handlePhotoChange = (file: File | undefined) => {
        if (file) {
            setPhotoFile(file);
            form.setValue("photo", file);
        } else {
            setPhotoFile(null);
            form.setValue("photo", undefined);
        }
    };

    async function onSubmit(values: FormValues) {
        const formData = new FormData();

        const data = {
            name: values.name,
            bio: values.bio,
        };

        formData.append("data", JSON.stringify(data));

        if (photoFile) {
            formData.append("photo", photoFile);
        }

        try {
            const result = await createAssociate(formData).unwrap();

            if (result.success) {
                toast.success("Associate created successfully!");
                router.push("/associates-management");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create associate");
        }
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-3">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Add Associate</h1>
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
                        <FileUpload onFileChange={(file) => handlePhotoChange(file as File)} />
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
                        disabled={isLoading}
                        className="w-full bg-main-color py-5 hover:bg-secondary-color hover:text-black text-white"
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
}
