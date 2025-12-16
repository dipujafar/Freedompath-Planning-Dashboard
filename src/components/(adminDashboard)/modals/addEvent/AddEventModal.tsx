"use client";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  eventDurationType,
  eventFormSchema,
  EventFormValues,
  eventType,
} from "./schema.utils";
import CountryStateCitySelector from "@/components/ui/CountryStateCitySelector";

interface AddEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedId?: number;
}

export default function AddEventModal({
  open,
  setOpen,
  selectedId,
}: AddEventModalProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventType: "",
      eventName: "",
      venueName: "",
      state: "",
      city: "",
      eventDuration: "",
      registrationFee: "",
      eventWebsite: "",
      images: [],
    },
  });

  const { register, control, setValue } = form;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      const newImages: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          newPreviews.push(result);
          newImages.push(result);

          if (newPreviews.length === files.length) {
            setUploadedImages((prev) => [...prev, ...newPreviews]);
            form.setValue("images", [
              ...form.getValues("images"),
              ...newImages,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EventFormValues) => {
    console.log({ ...data, images: uploadedImages });
    // Handle form submission
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0 scroll-hide">
        <DialogHeader className="px-6 pt-6 ">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {selectedId ? "Edit Event" : "Add Event"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedId ? "" : "Create a new martial arts event or tournament"}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 pb-6 space-y-6"
          >
            {/* Event Images Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Event Images
              </label>
              <div className="flex flex-wrap gap-3">
                {/* Upload Button */}
                <label
                  htmlFor="image-upload"
                  className="flex  flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground transition-colors bg-background"
                >
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Uploaded Images */}
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Event Information</span>
              </div>

              {/* Event Type */}
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="AGF" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventType.map((eventType) => (
                          <SelectItem
                            key={eventType.value}
                            value={eventType.value}
                          >
                            {eventType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Name */}
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Venue Name */}
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the venue name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Location */}
              <div>
                <CountryStateCitySelector
                  control={control}
                  setValue={setValue}
                  register={register}
                  userAddress={{ country: "United States" }}
                  className="bg-transparent"
                  label={true}
                />
              </div>

                {/* Venue Name */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter the zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Date */}
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Enter the event date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Duration */}
              <FormField
                control={form.control}
                name="eventDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="1 Day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventDurationType.map((eventDurationType) => (
                          <SelectItem
                            key={eventDurationType.value}
                            value={eventDurationType.value}
                          >
                            {eventDurationType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Registration Fee */}
              <FormField
                control={form.control}
                name="registrationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Registration Fee</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter registration fee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Website */}
              <FormField
                control={form.control}
                name="eventWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event website link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-main-color hover:bg-[#A01818] text-white font-medium"
            >
              {selectedId ? "Update Event" : "Create Event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
