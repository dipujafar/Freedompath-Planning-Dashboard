"use client";
import type React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spin } from "antd";
import {
  useGetAboutHeroSectionQuery,
  useUpdateAboutHeroSectionMutation,
  useGetFreedomPathPlanningQuery,
  useUpdateFreedomPathPlanningMutation,
  useGetAboutSteveDerayQuery,
  useUpdateAboutSteveDerayMutation,
} from "@/redux/api/aboutManagementApi";

// API IDs - These should be stored in env or config
const HERO_SECTION_ID = "694b79819aa607a9f5031ded";
const FREEDOM_PATH_ID = "694a5e2211e16d35f00c254b";
const STEVE_DERAY_ID = "694a636b2b1af9f5f68b2e16";

// Schema for freedom path options
const freedomOptionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub-Title is required"),
});

// Combined schema for all three steps
const formSchema = z.object({
  // Step 1: Hero Section
  heroTitle: z.string().min(1, "Title is required"),
  heroSubTitle: z.string().min(1, "Sub-Title is required"),
  projectsCompleted: z.string().min(1, "Projects Completed is required"),
  yearsExperience: z.string().min(1, "Years Experience is required"),
  clientReview: z.string().min(1, "Client Review is required"),
  heroImage: z.any().optional(),
  heroDescription: z.string().min(1, "Description is required"),

  // Step 2: Freedom Path Planning
  freedomMainTitle: z.string().min(1, "Title is required"),
  freedomImage: z.any().optional(),
  freedomOptions: z.array(freedomOptionSchema).min(1, "At least one option is required"),

  // Step 3: Business Owner
  businessOwnerImage: z.any().optional(),
  businessOwnerTitle: z.string().min(1, "Title is required"),
  businessOwnerBio: z.string().min(1, "Bio is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AboutUsForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [freedomImagePreview, setFreedomImagePreview] = useState<string | null>(null);
  const [businessOwnerImagePreview, setBusinessOwnerImagePreview] = useState<string | null>(null);

  // API Hooks
  const { data: heroData, isLoading: isHeroLoading } = useGetAboutHeroSectionQuery(HERO_SECTION_ID);
  const { data: freedomData, isLoading: isFreedomLoading } = useGetFreedomPathPlanningQuery(FREEDOM_PATH_ID);
  const { data: steveData, isLoading: isSteveLoading } = useGetAboutSteveDerayQuery(STEVE_DERAY_ID);

  const [updateHeroSection, { isLoading: isUpdatingHero }] = useUpdateAboutHeroSectionMutation();
  const [updateFreedomPath, { isLoading: isUpdatingFreedom }] = useUpdateFreedomPathPlanningMutation();
  const [updateSteveDeray, { isLoading: isUpdatingSteve }] = useUpdateAboutSteveDerayMutation();

  const steps = [
    { id: 0, label: "About us Hero Section" },
    { id: 1, label: "About Freedom Path Planning" },
    { id: 2, label: "Business Owner" },
  ];

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
      heroDescription: "",
      freedomMainTitle: "",
      freedomImage: null,
      freedomOptions: [{ title: "", subTitle: "" }],
      businessOwnerImage: null,
      businessOwnerTitle: "",
      businessOwnerBio: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "freedomOptions",
  });

  // Populate form with API data
  useEffect(() => {
    if (heroData?.data) {
      const hero = heroData.data;
      form.setValue("heroTitle", hero.title);
      form.setValue("heroSubTitle", hero.subTitle);
      form.setValue("projectsCompleted", hero.projects.toString());
      form.setValue("yearsExperience", hero.experience.toString());
      form.setValue("clientReview", hero.clientReview.toString());
      form.setValue("heroDescription", hero.description);
      if (hero.banner) {
        setHeroImagePreview(hero.banner);
      }
    }
  }, [heroData, form]);

  useEffect(() => {
    if (freedomData?.data) {
      const freedom = freedomData.data;
      form.setValue("freedomMainTitle", freedom.title);
      if (freedom.banner) {
        setFreedomImagePreview(freedom.banner);
      }
      if (freedom.options && freedom.options.length > 0) {
        form.setValue(
          "freedomOptions",
          freedom.options.map((opt) => ({
            title: opt.title,
            subTitle: opt.subTitle,
          }))
        );
      }
    }
  }, [freedomData, form]);

  useEffect(() => {
    if (steveData?.data) {
      const steve = steveData.data;
      form.setValue("businessOwnerTitle", steve.title);
      form.setValue("businessOwnerBio", steve.bio);
      if (steve.banner) {
        setBusinessOwnerImagePreview(steve.banner);
      }
    }
  }, [steveData, form]);

  // Image Handlers
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("heroImage", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setHeroImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeHeroImage = () => {
    form.setValue("heroImage", null, { shouldValidate: true });
    setHeroImagePreview(null);
  };

  const handleFreedomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("freedomImage", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setFreedomImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFreedomImage = () => {
    form.setValue("freedomImage", null, { shouldValidate: true });
    setFreedomImagePreview(null);
  };

  const handleBusinessOwnerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("businessOwnerImage", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setBusinessOwnerImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeBusinessOwnerImage = () => {
    form.setValue("businessOwnerImage", null, { shouldValidate: true });
    setBusinessOwnerImagePreview(null);
  };

  // Submit handlers for each section
  const handleHeroSubmit = async () => {
    const values = form.getValues();
    const formData = new FormData();

    const data = {
      title: values.heroTitle,
      subTitle: values.heroSubTitle,
      projects: parseInt(values.projectsCompleted),
      experience: parseInt(values.yearsExperience),
      clientReview: parseInt(values.clientReview),
      description: values.heroDescription,
    };

    formData.append("data", JSON.stringify(data));
    if (values.heroImage instanceof File) {
      formData.append("banner", values.heroImage);
    }

    try {
      const result = await updateHeroSection({
        id: HERO_SECTION_ID,
        formData,
      }).unwrap();

      if (result.success) {
        toast.success("Hero Section updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Hero Section");
    }
  };

  const handleFreedomSubmit = async () => {
    const values = form.getValues();
    const formData = new FormData();

    const data = {
      title: values.freedomMainTitle,
      options: values.freedomOptions.map((opt) => ({
        title: opt.title,
        subTitle: opt.subTitle,
      })),
    };

    formData.append("data", JSON.stringify(data));
    if (values.freedomImage instanceof File) {
      formData.append("banner", values.freedomImage);
    }

    try {
      const result = await updateFreedomPath({
        id: FREEDOM_PATH_ID,
        formData,
      }).unwrap();

      if (result.success) {
        toast.success("Freedom Path Planning updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Freedom Path Planning");
    }
  };

  const handleBusinessOwnerSubmit = async () => {
    const values = form.getValues();
    const formData = new FormData();

    const data = {
      title: values.businessOwnerTitle,
      bio: values.businessOwnerBio,
    };

    formData.append("data", JSON.stringify(data));
    if (values.businessOwnerImage instanceof File) {
      formData.append("banner", values.businessOwnerImage);
    }

    try {
      const result = await updateSteveDeray({
        id: STEVE_DERAY_ID,
        formData,
      }).unwrap();

      if (result.success) {
        toast.success("Business Owner updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Business Owner");
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const isLoading = isHeroLoading || isFreedomLoading || isSteveLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-0">
        {/* Step Tabs */}
        <div className="border-b">
          <div className="flex">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  currentStep === step.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
                        <Input
                          placeholder="Enter Title"
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
                  name="heroSubTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Sub-Title"
                          {...field}
                          className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                        />
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
                        <Input
                          placeholder="Enter Projects Completed"
                          type="number"
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
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Experience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Years Experience"
                          type="number"
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
                  name="clientReview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Review</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Client Review"
                          type="number"
                          {...field}
                          className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                        />
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
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <div className="relative rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:bg-muted/20 bg-[#F9FAFB] border-[#E1E1E1]">
                        {heroImagePreview ? (
                          <div className="relative">
                            <img
                              src={heroImagePreview}
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
                              <p className="text-sm text-muted-foreground">
                                Drag and drop or browse to choose a file
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleHeroImageChange}
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
                name="heroDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description..."
                        className="min-h-32 resize-y border border-[#E1E1E1] bg-[#F9FAFB]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  size="lg"
                  disabled={isUpdatingHero}
                  className="bg-main-color hover:bg-secondary-color hover:text-black w-[150px] text-white"
                  onClick={handleHeroSubmit}
                >
                  {isUpdatingHero ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
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
                      <Input
                        placeholder="Enter Title"
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
                name="freedomImage"
                render={() => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <div className="relative rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:bg-muted/20 bg-[#F9FAFB] border-[#E1E1E1]">
                        {freedomImagePreview ? (
                          <div className="relative">
                            <img
                              src={freedomImagePreview}
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeFreedomImage}
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
                              onChange={handleFreedomImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-base font-medium">Options</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 rounded-lg border bg-muted/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Option {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`freedomOptions.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Title"
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
                      name={`freedomOptions.${index}.subTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Sub-Title"
                              {...field}
                              className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => append({ title: "", subTitle: "" })}
                  className="text-primary hover:text-primary bg-secondary-color"
                >
                  <Plus className="mr-2 size-4" />
                  Add New Option
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  size="lg"
                  disabled={isUpdatingFreedom}
                  className="bg-main-color hover:bg-secondary-color hover:text-black w-[150px] text-white"
                  onClick={handleFreedomSubmit}
                >
                  {isUpdatingFreedom ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
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
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <div className="relative rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:bg-muted/20 bg-[#F9FAFB] border-[#E1E1E1]">
                        {businessOwnerImagePreview ? (
                          <div className="relative">
                            <img
                              src={businessOwnerImagePreview}
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
                              <p className="text-sm text-muted-foreground">
                                Drag and drop or browse to choose a file
                              </p>
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
                      <Input
                        placeholder="Enter Title"
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
                name="businessOwnerBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter bio..."
                        className="min-h-32 resize-y border border-[#E1E1E1] bg-[#F9FAFB]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  size="lg"
                  disabled={isUpdatingSteve}
                  className="w-full bg-main-color px-8 text-white hover:bg-black/90"
                  onClick={handleBusinessOwnerSubmit}
                >
                  {isUpdatingSteve ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
