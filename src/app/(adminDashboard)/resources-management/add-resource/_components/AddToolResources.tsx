import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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


const resourceSchema = z.object({
  resourceName: z
    .string()
    .trim()
    .min(1, { message: "Resource name is required" })
    .max(100, { message: "Resource name must be less than 100 characters" }),
  resourceDetails: z
    .string()
    .trim()
    .min(1, { message: "Resource details are required" })
    .max(500, { message: "Resource details must be less than 500 characters" }),
  resourceLink: z
    .string()
    .trim()
    .min(1, { message: "Resource link is required" })
    .url({ message: "Please enter a valid URL" }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const AddToolResources = () => {
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      resourceName: "",
      resourceDetails: "",
      resourceLink: "",
    },
  });

  const onSubmit = (data: ResourceFormValues) => {
    console.log("Form submitted:", data);
    form.reset();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="resourceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Resource Name
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

          <FormField
            control={form.control}
            name="resourceLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Resource Link
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter" {...field} className="border border-[#E1E1E1] bg-[#F9FAFB] py-5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6 py-5 bg-main-color hover:bg-[#4e6e8d]">
            Save Resources
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddToolResources;