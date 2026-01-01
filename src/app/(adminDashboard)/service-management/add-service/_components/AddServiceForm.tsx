"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSectionStep } from "./form-step/HeroSectionStep"
import { WhatClientGetsStep } from "./form-step/WhatClientGetsStep"
import { IncludedServicesStep } from "./form-step/IncludedServicesStep"
import { useRouter } from "next/navigation"
import { useCreateServiceMutation } from "@/redux/api/servicesApi"
import { toast } from "sonner"


const formSchema = z.object({
    serviceName: z.string().min(1, "Service name is required"),
    subTitle: z.string().min(1, "Sub-title is required"),
    servicePhoto: z
        .instanceof(File, { message: "Services photo is required" })
        .or(z.string().min(1, "Services photo is required")),
    clientGetsImage: z.instanceof(File, { message: "Image is required" }).or(z.string().min(1, "Image is required")),
    clientGetsItems: z.array(
        z.object({
            title: z.string().min(1, "Title is required"),
            subTitle: z.string().min(1, "Sub-title is required"),
        }),
    ),
    includedServices: z.array(
        z.object({
            title: z.string().min(1, "Title is required"),
            subTitle: z.string().min(1, "Sub-title is required"),
        }),
    ),
})

export type FormData = z.infer<typeof formSchema>

export function AddServiceForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();
    const [createService, { isLoading }] = useCreateServiceMutation();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serviceName: "",
            subTitle: "",
            clientGetsItems: [{ title: "", subTitle: "" }],
            includedServices: [{ title: "", subTitle: "" }],
        },
    })

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();

        const serviceData = {
            serviceName: data.serviceName,
            subTitle: data.subTitle,
            whatYourClientGets: {
                options: data.clientGetsItems
            },
            includedServices: data.includedServices
        }

        formData.append("data", JSON.stringify(serviceData));

        if (data.servicePhoto instanceof File) {
            formData.append("image", data.servicePhoto);
        }

        if (data.clientGetsImage instanceof File) {
            formData.append("clientGetsImage", data.clientGetsImage);
        }

        const toastId = toast.loading("Creating service...");

        try {
            await createService(formData).unwrap();
            toast.success("Service created successfully", { id: toastId });
            router.push("/service-management");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create service", { id: toastId });
            console.error(error);
        }
    }

    const handleNext = async () => {
        let fieldsToValidate: (keyof FormData)[] = []

        if (currentStep === 0) {
            fieldsToValidate = ["serviceName", "subTitle", "servicePhoto"]
        } else if (currentStep === 1) {
            fieldsToValidate = ["clientGetsItems", "clientGetsImage"]
        }

        const isValid = await form.trigger(fieldsToValidate)
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 2))
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const steps = ["Hero Section", "What Your Client Gets", "Included Services"]

    return (
        <div className="min-h-screen bg-background border border-border-color rounded-xl">
            <div className=" p-6">
                <div className="mb-6 flex items-center gap-2">
                    <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Add Service</h1>
                </div>

                <div className="mb-6 flex border-b">
                    {steps.map((step, index) => (
                        <button
                            key={step}
                            type="button"
                            disabled
                            className={`px-4 py-3 text-sm font-medium transition-colors ${currentStep === index ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
                                }`}
                        >
                            {step}
                        </button>
                    ))}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <HeroSectionStep form={form} />
                            <div className="flex justify-end">
                                <Button type="button" onClick={handleNext} className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px]">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <WhatClientGetsStep form={form} />
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handlePrevious} >
                                    Previous
                                </Button>
                                <Button type="button" onClick={handleNext} className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px]">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <IncludedServicesStep form={form} />
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handlePrevious}>
                                    Previous
                                </Button>
                                <Button type="submit" disabled={isLoading} className="bg-main-color hover:bg-secondary-color hover:text-black">
                                    {isLoading ? "Creating..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
