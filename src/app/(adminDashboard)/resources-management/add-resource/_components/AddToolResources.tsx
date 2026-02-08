"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { useCreateToolResourceMutation } from "@/redux/api/toolResourcesApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const resourceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Resource name is required" })
    .max(100, { message: "Resource name must be less than 100 characters" }),
  details: z
    .string()
    .trim()
    .min(1, { message: "Resource details are required" })
    .max(500, { message: "Resource details must be less than 500 characters" }),
  link: z
    .string()
    .trim()
    .min(1, { message: "Resource link is required" })
    .url({ message: "Please enter a valid URL" }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const AddToolResources = () => {
  const router = useRouter();
  const [createToolResource, { isLoading }] = useCreateToolResourceMutation();

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      details: "",
      link: "",
    },
  });

  const onSubmit = async (data: ResourceFormValues) => {
    try {
      const result = await createToolResource({
        name: data.name,
        details: data.details,
        link: data.link,
      }).unwrap();

      if (result.success) {
        toast.success("Tool resource created successfully!");
        form.reset();
        router.push("/resources-management");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create tool resource");
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
                <FormLabel className="font-medium">Resource Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter resource name"
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

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Resource Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    className="border border-[#E1E1E1] bg-[#F9FAFB] py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-5 bg-main-color hover:bg-secondary-color hover:text-black"
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

export default AddToolResources;