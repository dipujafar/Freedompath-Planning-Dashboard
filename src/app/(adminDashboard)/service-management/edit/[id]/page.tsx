"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useRouter, useParams } from "next/navigation"
import {
    useGetSingleServiceQuery,
    useUpdateServiceMutation
} from "@/redux/api/servicesApi"
import { toast } from "sonner"
import { FileUpload } from "../../add-service/_components/FileUpload"
import { useFieldArray } from "react-hook-form"

const formSchema = z.object({
    serviceName: z.string().min(1, "Service name is required"),
    subTitle: z.string().min(1, "Sub-title is required"),
    servicePhoto: z
        .instanceof(File, { message: "Services photo is required" })
        .or(z.string().min(1, "Services photo is required")),
    clientGetsImage: z.instanceof(File, { message: "Image is required" }).or(z.string().min(1, "Image is required")),
    clientGetsItems: z.array(
        z.object({
            id: z.string().optional(),
            title: z.string().min(1, "Title is required"),
            subTitle: z.string().min(1, "Sub-title is required"),
        }),
    ),
    includedServices: z.array(
        z.object({
            id: z.string().optional(),
            title: z.string().min(1, "Title is required"),
            subTitle: z.string().min(1, "Sub-title is required"),
        }),
    ),
})

type FormData = z.infer<typeof formSchema>

export default function EditServicePage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [existingServicePhoto, setExistingServicePhoto] = useState<string | null>(null)
    const [existingClientGetsImage, setExistingClientGetsImage] = useState<string | null>(null)
    const router = useRouter()
    const params = useParams()
    const serviceId = params.id as string

    const { data: serviceData, isLoading: isFetching } = useGetSingleServiceQuery(serviceId, {
        skip: !serviceId,
    })

    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serviceName: "",
            subTitle: "",
            clientGetsItems: [{ title: "", subTitle: "" }],
            includedServices: [{ title: "", subTitle: "" }],
        },
    })

    const { fields: clientGetsFields, append: appendClientGets, remove: removeClientGets } = useFieldArray({
        control: form.control,
        name: "clientGetsItems",
    })

    const { fields: includedFields, append: appendIncluded, remove: removeIncluded } = useFieldArray({
        control: form.control,
        name: "includedServices",
    })

    // Populate form with existing data
    useEffect(() => {
        if (serviceData?.data) {
            const service = serviceData.data
            form.setValue("serviceName", service.serviceName)
            form.setValue("subTitle", service.subTitle)

            if (service.image) {
                setExistingServicePhoto(service.image)
                form.setValue("servicePhoto", service.image)
            }

            if (service.whatYourClientGets?.image) {
                setExistingClientGetsImage(service.whatYourClientGets.image)
                form.setValue("clientGetsImage", service.whatYourClientGets.image)
            }

            if (service.whatYourClientGets?.options && service.whatYourClientGets.options.length > 0) {
                form.setValue("clientGetsItems", service.whatYourClientGets.options.map((opt: any) => ({
                    id: opt.id,
                    title: opt.title,
                    subTitle: opt.subTitle,
                })))
            }

            if (service.includedServices && service.includedServices.length > 0) {
                form.setValue("includedServices", service.includedServices.map((svc: any) => ({
                    id: svc.id,
                    title: svc.title,
                    subTitle: svc.subTitle,
                })))
            }
        }
    }, [serviceData, form])

    const onSubmit = async (data: FormData) => {
        const formData = new FormData()

        // Build the data object according to API spec
        const serviceDataPayload: any = {
            serviceName: data.serviceName,
            subTitle: data.subTitle,
            includedServices: data.includedServices.map(item => {
                const obj: any = {
                    title: item.title,
                    subTitle: item.subTitle,
                }
                if (item.id) {
                    obj.id = item.id
                }
                return obj
            }),
            whatYourClientGets: {
                options: data.clientGetsItems.map(item => {
                    const obj: any = {
                        title: item.title,
                        subTitle: item.subTitle,
                    }
                    if (item.id) {
                        obj.id = item.id
                    }
                    return obj
                })
            }
        }

        formData.append("data", JSON.stringify(serviceDataPayload))

        // Handle service photo
        if (data.servicePhoto instanceof File) {
            formData.append("image", data.servicePhoto)
        } else if (existingServicePhoto) {
            // Fetch existing image and re-upload as file
            try {
                const response = await fetch(existingServicePhoto)
                const blob = await response.blob()
                const fileName = existingServicePhoto.split('/').pop() || 'service-image.jpg'
                formData.append("image", blob, fileName)
            } catch (e) {
                console.error("Failed to fetch existing service image", e)
            }
        }

        // Handle clientGetsImage
        if (data.clientGetsImage instanceof File) {
            formData.append("clientGetsImage", data.clientGetsImage)
        } else if (existingClientGetsImage) {
            // Fetch existing image and re-upload as file
            try {
                const response = await fetch(existingClientGetsImage)
                const blob = await response.blob()
                const fileName = existingClientGetsImage.split('/').pop() || 'client-gets-image.jpg'
                formData.append("clientGetsImage", blob, fileName)
            } catch (e) {
                console.error("Failed to fetch existing clientGetsImage", e)
            }
        }

        const toastId = toast.loading("Updating service...")

        try {
            const result = await updateService({ id: serviceId, formData }).unwrap()
            if (result.success) {
                toast.success("Service updated successfully", { id: toastId })
                router.push("/service-management")
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update service", { id: toastId })
            console.error(error)
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

    if (isFetching) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-main-color" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background border border-border-color rounded-xl">
            <div className="p-6">
                <div className="mb-6 flex items-center gap-2">
                    <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Edit Service</h1>
                </div>

                <div className="mb-6 flex border-b">
                    {steps.map((step, index) => (
                        <button
                            key={step}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${currentStep === index
                                ? "border-b-2 border-primary text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {step}
                        </button>
                    ))}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                    {/* Step 0: Hero Section */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="serviceName">Service Name</Label>
                                    <Input
                                        id="serviceName"
                                        placeholder="Enter Service Name"
                                        {...form.register("serviceName")}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                    {form.formState.errors.serviceName && (
                                        <p className="text-sm text-destructive">{form.formState.errors.serviceName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subTitle">Sub-Title</Label>
                                    <Input
                                        id="subTitle"
                                        placeholder="Enter Sub-Title"
                                        {...form.register("subTitle")}
                                        className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                                    />
                                    {form.formState.errors.subTitle && (
                                        <p className="text-sm text-destructive">{form.formState.errors.subTitle.message}</p>
                                    )}
                                </div>



                                <div className="space-y-2">
                                    <Label>Services Photo</Label>
                                    {existingServicePhoto ? (
                                        <div className="relative w-fit">
                                            <img
                                                src={existingServicePhoto}
                                                alt="Current service"
                                                className="w-40 h-40 object-cover rounded-lg border border-[#E1E1E1]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExistingServicePhoto(null)
                                                    form.setValue("servicePhoto", "" as any)
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <FileUpload onFileChange={(file) => {
                                            if (file) form.setValue("servicePhoto", file as File)
                                            else form.setValue("servicePhoto", "" as any)
                                        }} />
                                    )}
                                    {form.formState.errors.servicePhoto && (
                                        <p className="text-sm text-destructive">{form.formState.errors.servicePhoto.message as string}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" onClick={handleNext} className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px]">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: What Client Gets */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium">What Your Client Gets</h2>

                                <div className="space-y-2">
                                    <Label>Client Gets Image</Label>
                                    {existingClientGetsImage ? (
                                        <div className="relative w-fit">
                                            <img
                                                src={existingClientGetsImage}
                                                alt="Current client gets"
                                                className="w-40 h-40 object-cover rounded-lg border border-[#E1E1E1]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExistingClientGetsImage(null)
                                                    form.setValue("clientGetsImage", "" as any)
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <FileUpload onFileChange={(file) => {
                                            if (file) form.setValue("clientGetsImage", file as File)
                                            else form.setValue("clientGetsImage", "" as any)
                                        }} />
                                    )}
                                    {form.formState.errors.clientGetsImage && (
                                        <p className="text-sm text-destructive">{form.formState.errors.clientGetsImage.message as string}</p>
                                    )}
                                </div>

                                {clientGetsFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                        <div className="space-y-2">
                                            <Label htmlFor={`clientGetsItems.${index}.title`}>Title</Label>
                                            <Input
                                                id={`clientGetsItems.${index}.title`}
                                                placeholder="Enter title"
                                                className="border border-[#E1E1E1] bg-white py-5"
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
                                                placeholder="Enter sub-title"
                                                className="border border-[#E1E1E1] bg-white py-5"
                                                {...form.register(`clientGetsItems.${index}.subTitle`)}
                                            />
                                            {form.formState.errors.clientGetsItems?.[index]?.subTitle && (
                                                <p className="text-sm text-destructive">
                                                    {form.formState.errors.clientGetsItems[index]?.subTitle?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {clientGetsFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeClientGets(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendClientGets({ title: "", subTitle: "" })}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add New Item
                                </Button>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handlePrevious}>
                                    Previous
                                </Button>
                                <Button type="button" onClick={handleNext} className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px]">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Included Services */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium">Included Services</h2>

                                {includedFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                        <div className="space-y-2">
                                            <Label htmlFor={`includedServices.${index}.title`}>Title</Label>
                                            <Input
                                                id={`includedServices.${index}.title`}
                                                placeholder="Enter title"
                                                className="border border-[#E1E1E1] bg-white py-5"
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
                                                placeholder="Enter sub-title"
                                                className="border border-[#E1E1E1] bg-white py-5"
                                                {...form.register(`includedServices.${index}.subTitle`)}
                                            />
                                            {form.formState.errors.includedServices?.[index]?.subTitle && (
                                                <p className="text-sm text-destructive">
                                                    {form.formState.errors.includedServices[index]?.subTitle?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {includedFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeIncluded(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendIncluded({ title: "", subTitle: "" })}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add New Service
                                </Button>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handlePrevious}>
                                    Previous
                                </Button>
                                <Button type="submit" disabled={isUpdating} className="bg-main-color hover:bg-secondary-color hover:text-black">
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Service"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
