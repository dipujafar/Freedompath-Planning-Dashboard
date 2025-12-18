"use client"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Upload, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  designation: z.string().min(1, "Designation is required"),
  clientPhoto: z.instanceof(File).optional().or(z.string().optional()),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
})

type FormValues = z.infer<typeof formSchema>

export function AddTestimonialForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      designation: "",
      description: "",
      rating: 0,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue("clientPhoto", file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      form.setValue("clientPhoto", file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data)
    // Handle form submission here
  }

  const currentRating = form.watch("rating")

  return (
    <div className="min-h-screen bg-background p-4">
      <div >
        <div className="mb-6 flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Add Testimonial</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Client Name" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Client Designation" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientPhoto"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Client Photo</FormLabel>
                  <FormControl>
                    <div
                      className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed  border-[#E1E1E1] bg-[#F9FAFB]  transition-colors hover:bg-muted/50"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-8">
                          <div className="rounded-full bg-primary/10 p-3">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">Upload your image</p>
                            <p className="text-sm text-muted-foreground">Drag and drop or browse to choose a file</p>
                          </div>
                        </div>
                      )}
                      <input
                        id="file-upload"
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the comment which client says " className="min-h-[120px] resize-none border border-[#E1E1E1] bg-[#F9FAFB] " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Star</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= (hoveredStar || currentRating)
                                ? "fill-[#3673DE] text-[#3673DE]"
                                : "fill-none text-muted-foreground"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-main-color text-background hover:bg-foreground/90 py-5">
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
