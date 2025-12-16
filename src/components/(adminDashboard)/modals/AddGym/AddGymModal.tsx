"use client";
import type React from "react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { daysOfWeek, formSchema, FormValues, timeSlots } from "./schema.utils";
import Image from "next/image";
import CountryStateCitySelector from "@/components/ui/CountryStateCitySelector";

interface AddGymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: number;
}

export function AddGymModal({
  open,
  onOpenChange,
  selectedId,
}: AddGymModalProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [disciplineInput, setDisciplineInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      gymName: "",
      description: "",
      address: "",
      state: "",
      city: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      website: "",
      facebook: "",
      instagram: "",
      openMatSchedule: [
        { day: "Monday", startTime: "12:30 PM", endTime: "2:30 PM" },
      ],
      classSchedule: [
        {
          className: "",
          day: "Monday",
          startTime: "12:30 PM",
          endTime: "2:30 PM",
        },
      ],
      disciplines: [],
    },
  });

  const { setValue, control, register } = form;

  const {
    fields: openMatFields,
    append: appendOpenMat,
    remove: removeOpenMat,
  } = useFieldArray({
    control: form.control,
    name: "openMatSchedule",
  });

  const {
    fields: classFields,
    append: appendClass,
    remove: removeClass,
  } = useFieldArray({
    control: form.control,
    name: "classSchedule",
  });

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
            setImagePreviews((prev) => [...prev, ...newPreviews]);
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
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDisciplineKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = disciplineInput.trim();
      if (trimmedValue) {
        const currentDisciplines = form.getValues("disciplines");
        if (!currentDisciplines.includes(trimmedValue)) {
          form.setValue("disciplines", [...currentDisciplines, trimmedValue]);
        }
        setDisciplineInput("");
      }
    }
  };

  const removeDisciplineTag = (indexToRemove: number) => {
    const currentDisciplines = form.getValues("disciplines");
    form.setValue(
      "disciplines",
      currentDisciplines.filter((_, index) => index !== indexToRemove)
    );
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scroll-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {selectedId ? "Edit Gym" : "Add Gym"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {selectedId
              ? ""
              : "Fill in the details to add a new gym to your platform"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Upload Images */}
            <div>
              <FormLabel className="text-sm font-medium mb-3 block">
                Upload Images
              </FormLabel>
              <div className="flex gap-3">
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24 group">
                    <Image
                      width={96}
                      height={96}
                      src={preview || "/placeholder.svg"}
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="gymName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Gym Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter gym name" {...field} />
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
                          <FormLabel className="text-sm">Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter gym description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Location</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div >
                      <CountryStateCitySelector
                        control={control}
                        setValue={setValue}
                        register={register}
                        userAddress={{ country: "United States" }}
                        className="bg-transparent"
                        label={true}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Open Mat Schedule */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    Open Mat Schedule
                  </h3>
                  <div className="space-y-4">
                    {openMatFields.map((field, index) => (
                      <div key={field.id} className="space-y-3 relative">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeOpenMat(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        <FormField
                          control={form.control}
                          name={`openMatSchedule.${index}.day`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Day</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfWeek.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                          <FormField
                            control={form.control}
                            name={`openMatSchedule.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Time</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <span className="text-sm text-muted-foreground pb-2">
                            to
                          </span>

                          <FormField
                            control={form.control}
                            name={`openMatSchedule.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm opacity-0">
                                  End
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                      onClick={() =>
                        appendOpenMat({
                          day: "Monday",
                          startTime: "12:30 PM",
                          endTime: "2:30 PM",
                        })
                      }
                    >
                      + Add More Days
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Website</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter website URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Facebook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Facebook URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Instagram URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Class Schedule */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Class Schedule</h3>
                  <div className="space-y-4">
                    {classFields.map((field, index) => (
                      <div key={field.id} className="space-y-3 relative">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 z-10"
                            onClick={() => removeClass(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        <FormField
                          control={form.control}
                          name={`classSchedule.${index}.className`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Class Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the class name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`classSchedule.${index}.day`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Day</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfWeek.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                          <FormField
                            control={form.control}
                            name={`classSchedule.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Time</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <span className="text-sm text-muted-foreground pb-2">
                            to
                          </span>

                          <FormField
                            control={form.control}
                            name={`classSchedule.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm opacity-0">
                                  End
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                      onClick={() =>
                        appendClass({
                          className: "",
                          day: "Monday",
                          startTime: "12:30 PM",
                          endTime: "2:30 PM",
                        })
                      }
                    >
                      + Add More Classes
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Disciplines - Full Width */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Disciplines</h3>
              <FormField
                control={form.control}
                name="disciplines"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          placeholder="Type a discipline and press Enter"
                          value={disciplineInput}
                          onChange={(e) => setDisciplineInput(e.target.value)}
                          onKeyDown={handleDisciplineKeyDown}
                        />
                        {form.watch("disciplines").length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {form
                              .watch("disciplines")
                              .map((discipline, index) => (
                                <div
                                  key={index}
                                  className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm"
                                >
                                  <span>{discipline}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeDisciplineTag(index)}
                                    className="hover:bg-pink-100 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}

            <Button
              type="submit"
              className="bg-main-color hover:bg-red-700 text-white px-8 w-full"
            >
              {selectedId ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
