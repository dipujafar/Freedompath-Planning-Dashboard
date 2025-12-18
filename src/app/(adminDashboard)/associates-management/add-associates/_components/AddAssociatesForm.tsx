"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useRef } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/app/(adminDashboard)/service-management/add-service/_components/FileUpload"
import RichTextEditor from "@/components/shared/RichTextEditor"

const formSchema = z.object({
    name: z.string().min(1, "Associate name is required"),
    photo: z.instanceof(File).optional().or(z.string().optional()),
    bio: z.string().min(1, "Bio is required"),
})

type FormValues = z.infer<typeof formSchema>

export function AddAssociatesForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [editorContent, setEditorContent] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            photo: undefined,
            bio: "",
        },
    })

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            form.setValue("photo", file)
        } else {
            setImagePreview(null)
            form.setValue("photo", undefined)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            handleImageChange(file)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    function onSubmit(values: FormValues) {
        console.log(values)
        // Handle form submission
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-3">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Add Associates</h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Associates Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel className="font-medium">Associates Photo</FormLabel>
                        <FileUpload onFileChange={(file) => form.setValue("photo", file as File)} />
                    </div>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-normal text-foreground">Bio</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Enter Associates Bio"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-blue-500 py-5 hover:bg-gray-800 text-white">
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}
