"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useCreateBookResourceMutation } from "@/redux/api/bookResourcesApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const bookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Book name is required" })
    .max(100, { message: "Book name must be less than 100 characters" }),
  details: z
    .string()
    .trim()
    .min(1, { message: "Resource details are required" })
    .max(500, { message: "Resource details must be less than 500 characters" }),
});

type BookFormValues = z.infer<typeof bookSchema>;

const AddEBookResource = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const [createBookResource, { isLoading }] = useCreateBookResourceMutation();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: "",
      details: "",
    },
  });

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setImage(droppedFile);
      setImagePreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const onSubmit = async (data: BookFormValues) => {
    const formData = new FormData();

    const jsonData = {
      name: data.name,
      details: data.details,
    };

    formData.append("data", JSON.stringify(jsonData));

    if (image) {
      formData.append("image", image);
    }

    if (file) {
      formData.append("file", file);
    }

    try {
      const result = await createBookResource(formData).unwrap();

      if (result.success) {
        toast.success("Book resource created successfully!");
        form.reset();
        removeImage();
        removeFile();
        router.push("/resources-management");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create book resource");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Book Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter book name"
                    {...field}
                    className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Resource Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter resource details"
                    {...field}
                    className="min-h-24 resize-y border border-[#E1E1E1] bg-[#F9FAFB]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="font-medium">Upload Book Cover Image</label>
            {imagePreview ? (
              <div className="relative border border-border rounded-lg p-4">
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-md object-contain"
                />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {image?.name}
                </p>
              </div>
            ) : (
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("image-input")?.click()}
                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-[#F9FAFB] border-[#E1E1E1]"
              >
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-foreground">Upload your image</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or browse to choose a file
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-medium">Upload PDF File</label>
            {file ? (
              <div className="relative border border-border rounded-lg p-4">
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <Upload className="text-primary" />
                  <p className="text-sm text-foreground truncate">{file.name}</p>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("file-input")?.click()}
                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-[#F9FAFB] border-[#E1E1E1]"
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-foreground">Upload your PDF</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or browse to choose a file
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-main-color hover:bg-secondary-color hover:text-black py-5"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Save Resource"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddEBookResource;
