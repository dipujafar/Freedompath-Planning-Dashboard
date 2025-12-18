import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const bookSchema = z.object({
  bookName: z
    .string()
    .trim()
    .min(1, { message: "Book name is required" })
    .max(100, { message: "Book name must be less than 100 characters" }),
  resourceDetails: z
    .string()
    .trim()
    .min(1, { message: "Resource details are required" })
    .max(500, { message: "Resource details must be less than 500 characters" }),
});

type BookFormValues = z.infer<typeof bookSchema>;

const AddEBookResource = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      bookName: "",
      resourceDetails: "",
    },
  });

  const handlePhotoDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setPhoto(droppedFile);
      setPhotoPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPhoto(selectedFile);
      setPhotoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const onSubmit = (data: BookFormValues) => {
    console.log("Form submitted:", { ...data, photo, file });
    form.reset();
    removePhoto();
    removeFile();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bookName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Book Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resourceDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Resource Details
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="font-medium">
              Upload Photo
            </label>
            {photoPreview ? (
              <div className="relative border border-border rounded-lg p-4">
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-md object-contain"
                />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {photo?.name}
                </p>
              </div>
            ) : (
              <div
                onDrop={handlePhotoDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("photo-input")?.click()}
                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-[#F9FAFB] border-[#E1E1E1]"
              >
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
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
            <label className="font-medium">
              Upload File
            </label>
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
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-foreground">Upload your File</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or browse to choose a file
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full mt-6 bg-main-color hover:bg-[#4e6e8d] py-5">
            Save Resources
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddEBookResource;
