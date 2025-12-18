"use client"
import type React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Combined schema for all three steps
const itemSchema = z.object({
  image: z.any().refine((file) => file !== null, "Image is required"),
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub-Title is required"),
})

const formSchema = z.object({
  // Step 1: Hero Section
  heroTitle: z.string().min(1, "Title is required"),
  heroSubTitle: z.string().min(1, "Sub-Title is required"),
  projectsCompleted: z.string().min(1, "Projects Completed is required"),
  yearsExperience: z.string().min(1, "Years Experience is required"),
  clientReview: z.string().min(1, "Client Review is required"),
  heroImage: z.any().refine((file) => file !== null, "Image is required"),
  heroBottomSubTitle: z.string().min(1, "Sub-Title is required"),

  // Step 2: Freedom Path Planning
  freedomMainTitle: z.string().min(1, "Title is required"),
  freedomItems: z.array(itemSchema).min(1, "At least one item is required"),

  // Step 3: Business Owner
  businessOwnerImage: z.any().refine((file) => file !== null, "Image is required"),
  businessOwnerTitle: z.string().min(1, "Title is required"),
  businessOwnerBio: z.string().min(1, "Bio is required"),
})

type FormValues = z.infer<typeof formSchema>

export function AboutUsForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null)
  const [freedomImagePreviews, setFreedomImagePreviews] = useState<{ [key: number]: string | null }>({})
  const [businessOwnerImagePreview, setBusinessOwnerImagePreview] = useState<string | null>(null)

  const steps = [
    { id: 0, label: "About us Hero Section" },
    { id: 1, label: "About Freedom Path Planning" },
    { id: 2, label: "Business Owner" },
  ]

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      heroTitle: "",
      heroSubTitle: "",
      projectsCompleted: "",
      yearsExperience: "",
      clientReview: "",
      heroImage: null,
      heroBottomSubTitle: "",
      freedomMainTitle: "",
      freedomItems: [
        {
          image: null,
          title: "",
          subTitle: "",
        },
      ],
      businessOwnerImage: null,
      businessOwnerTitle: "",
      businessOwnerBio: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "freedomItems",
  })

  // Hero Section Image Handlers
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("heroImage", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeHeroImage = () => {
    form.setValue("heroImage", null, { shouldValidate: true })
    setHeroImagePreview(null)
  }

  // Freedom Path Image Handlers
  const handleFreedomImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue(`freedomItems.${index}.image`, file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setFreedomImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFreedomImage = (index: number) => {
    form.setValue(`freedomItems.${index}.image`, null, { shouldValidate: true })
    setFreedomImagePreviews((prev) => ({
      ...prev,
      [index]: null,
    }))
  }

  // Business Owner Image Handlers
  const handleBusinessOwnerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("businessOwnerImage", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setBusinessOwnerImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBusinessOwnerImage = () => {
    form.setValue("businessOwnerImage", null, { shouldValidate: true })
    setBusinessOwnerImagePreview(null)
  }

  // Validate current step before moving to next
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormValues)[] = []

    if (step === 0) {
      fieldsToValidate = [
        "heroTitle",
        "heroSubTitle",
        "projectsCompleted",
        "yearsExperience",
        "clientReview",
        "heroImage",
        "heroBottomSubTitle",
      ]
    } else if (step === 1) {
      fieldsToValidate = ["freedomMainTitle", "freedomItems"]
    } else if (step === 2) {
      fieldsToValidate = ["businessOwnerImage", "businessOwnerTitle", "businessOwnerBio"]
    }

    const result = await form.trigger(fieldsToValidate as any)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepClick = async (stepId: number) => {
    // Can only go to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }

  const onSubmit = (data: FormValues) => {
    console.log("Complete Form Data:", data)
    alert("Form submitted successfully! Check console for data.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        {/* Step Tabs */}
        <div className="border-b">
          <div className="flex">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  currentStep === step.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  step.id > currentStep && "cursor-not-allowed opacity-50",
                )}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Hero Section */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-black/70">About us Hero Section</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="heroTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Title" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroSubTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Sub-Title" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="projectsCompleted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Projects Completed</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Projects Completed" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Years Experience" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientReview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Review</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Client Review" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="heroImage"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative rounded-lg border-2 border-dashed border-border  p-8 transition-colors hover:bg-muted/20 bg-[#F9FAFB] border-[#E1E1E1]">
                        {heroImagePreview ? (
                          <div className="relative">
                            <img
                              src={heroImagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeHeroImage}
                              className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white transition-colors hover:bg-destructive/90"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex cursor-pointer flex-col items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Upload className="size-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="font-medium">Upload your image</p>
                              <p className="text-sm text-muted-foreground">Drag and drop or browse to choose a file</p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageChange} />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroBottomSubTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter" {...field}  className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" size="lg" variant="outline" className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px] text-white" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Freedom Path Planning */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-black/70">About Freedom Path Planning</h2>

              <FormField
                control={form.control}
                name="freedomMainTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-6 rounded-lg border bg-muted/5 p-6">
                  <FormField
                    control={form.control}
                    name={`freedomItems.${index}.image`}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="relative rounded-lg border-2 border-dashed border-border  p-8 transition-colors hover:bg-muted/20  border-[#E1E1E1] bg-[#F9FAFB]">
                            {freedomImagePreviews[index] ? (
                              <div className="relative">
                                <img
                                  src={freedomImagePreviews[index]! || "/placeholder.svg"}
                                  alt="Preview"
                                  className="mx-auto max-h-64 rounded-lg object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFreedomImage(index)}
                                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white transition-colors hover:bg-destructive/90"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex cursor-pointer flex-col items-center gap-2">
                                <div className="rounded-full bg-primary/10 p-3">
                                  <Upload className="size-6 text-primary" />
                                </div>
                                <div className="text-center">
                                  <p className="font-medium">Upload your image</p>
                                  <p className="text-sm text-muted-foreground">
                                    Drag and drop or browse to choose a file
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFreedomImageChange(index, e)}
                                />
                              </label>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`freedomItems.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Title" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"  />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`freedomItems.${index}.subTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        remove(index)
                        setFreedomImagePreviews((prev) => {
                          const newPreviews = { ...prev }
                          delete newPreviews[index]
                          return newPreviews
                        })
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  append({
                    image: null,
                    title: "",
                    subTitle: "",
                  })
                }
                className="text-primary hover:text-primary bg-secondary-color"
              >
                <Plus className="mr-2 size-4" />
                Add New
              </Button>

              <div className="flex justify-end gap-4">
                <Button type="button" size="lg" variant="outline" className="bg-main-color hover:bg-secondary-color hover:text-black w-[100px] text-white" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Business Owner */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-black/70">Business Owner</h2>

              <FormField
                control={form.control}
                name="businessOwnerImage"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative rounded-lg border-2 border-dashed border-border  p-8 transition-colors hover:bg-muted/20  border-[#E1E1E1] bg-[#F9FAFB] ">
                        {businessOwnerImagePreview ? (
                          <div className="relative">
                            <img
                              src={businessOwnerImagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeBusinessOwnerImage}
                              className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white transition-colors hover:bg-destructive/90"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex cursor-pointer flex-col items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Upload className="size-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="font-medium">Upload your image</p>
                              <p className="text-sm text-muted-foreground">Drag and drop or browse to choose a file</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleBusinessOwnerImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessOwnerTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessOwnerBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter bio..." className="min-h-32 resize-y border border-[#E1E1E1] bg-[#F9FAFB]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" size="lg" className="w-full bg-main-color px-8 text-white hover:bg-black/90">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
