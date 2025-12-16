"use client"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormData } from "../AddServiceForm"
import { FileUpload } from "../FileUpload"


interface WhatClientGetsStepProps {
    form: UseFormReturn<FormData>
}

export function WhatClientGetsStep({ form }: WhatClientGetsStepProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "clientGetsItems",
    })

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">What Your Client Gets</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <FileUpload onFileChange={(file) => form.setValue("clientGetsImage", file as File)} />
                    {form.formState.errors.clientGetsImage && (
                        <p className="text-sm text-destructive">{form.formState.errors.clientGetsImage.message as string}</p>
                    )}
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`clientGetsItems.${index}.title`}>Title</Label>
                            <Input
                                id={`clientGetsItems.${index}.title`}
                                placeholder="Enter"
                                className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                {...form.register(`clientGetsItems.${index}.title`)}
                            />
                            {form.formState.errors.clientGetsItems?.[index]?.title && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.clientGetsItems[index]?.title?.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`clientGetsItems.${index}.subTitle`}>Sub-Title</Label>
                            <Input
                                id={`clientGetsItems.${index}.subTitle`}
                                placeholder="Enter"
                                className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                {...form.register(`clientGetsItems.${index}.subTitle`)}
                            />
                            {form.formState.errors.clientGetsItems?.[index]?.subTitle && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.clientGetsItems[index]?.subTitle?.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => append({ title: "", subTitle: "" })}
                                className="text-blue-600 hover:text-blue-700 bg-secondary-color"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Add New
                            </Button>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
