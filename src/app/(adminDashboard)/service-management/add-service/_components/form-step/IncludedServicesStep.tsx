"use client"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormData } from "../AddServiceForm"

interface IncludedServicesStepProps {
    form: UseFormReturn<FormData>
}

export function IncludedServicesStep({ form }: IncludedServicesStepProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "includedServices",
    })

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Included Services</h2>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`includedServices.${index}.title`}>Title</Label>
                            <Input
                                id={`includedServices.${index}.title`}
                                placeholder="Enter"
                                className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                {...form.register(`includedServices.${index}.title`)}
                            />
                            {form.formState.errors.includedServices?.[index]?.title && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.includedServices[index]?.title?.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`includedServices.${index}.subTitle`}>Sub-Title</Label>
                            <Input
                                id={`includedServices.${index}.subTitle`}
                                placeholder="Enter"
                                className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                {...form.register(`includedServices.${index}.subTitle`)}
                            />
                            {form.formState.errors.includedServices?.[index]?.subTitle && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.includedServices[index]?.subTitle?.message}
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
