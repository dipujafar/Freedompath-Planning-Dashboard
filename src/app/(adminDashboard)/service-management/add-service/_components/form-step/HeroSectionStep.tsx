"use client"
import type { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileUpload } from "../FileUpload"
import { FormData } from "../AddServiceForm"

interface HeroSectionStepProps {
    form: UseFormReturn<FormData>
}

export function HeroSectionStep({ form }: HeroSectionStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input id="serviceName" placeholder="Enter Service Name" {...form.register("serviceName")} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                    {form.formState.errors.serviceName && (
                        <p className="text-sm text-destructive">{form.formState.errors.serviceName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subTitle">Sub-Title</Label>
                    <Input id="subTitle" placeholder="Enter Sub-Title" {...form.register("subTitle")} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                    {form.formState.errors.subTitle && (
                        <p className="text-sm text-destructive">{form.formState.errors.subTitle.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Services Photo</Label>
                    <FileUpload onFileChange={(file) => form.setValue("servicePhoto", file as File)} />
                    {form.formState.errors.servicePhoto && (
                        <p className="text-sm text-destructive">{form.formState.errors.servicePhoto.message as string}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
