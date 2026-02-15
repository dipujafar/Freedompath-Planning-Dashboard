'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGetFooterContentQuery, useUpdateFooterContentMutation } from '@/redux/api/footerApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const contactFormSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    address: z.string().min(5, 'Please enter a valid address'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    link1: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    link2: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    link3: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
    email: '',
    address: '',
    description: '',
    link1: '',
    link2: '',
    link3: '',
};

export function ContentForm() {
    const { data, isLoading: isFetching } = useGetFooterContentQuery(undefined);
    const [updateFooterContent, { isLoading }] = useUpdateFooterContentMutation();
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues,
    });

    async function onSubmit(values: ContactFormValues) {

        const formattedData = {
            email: values.email,
            address: values.address,
            description: values.description,
            facebook: values.link1,
            twitter: values.link2,
            linkedin: values.link3,
        }

        try {
            const result = await updateFooterContent(formattedData).unwrap();
            if (result.success) {
                toast.success("Footer Content updated successfully!");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update Footer Content");
        }
    }


    useEffect(() => {
        if (data?.data?.data?.[0]) {
            form.setValue('email', data?.data?.data?.[0]?.email);
            form.setValue('address', data?.data?.data?.[0]?.address);
            form.setValue('description', data?.data?.data?.[0]?.description);
            form.setValue('link1', data?.data?.data?.[0]?.facebook);
            form.setValue('link2', data?.data?.data?.[0]?.twitter);
            form.setValue('link3', data?.data?.data?.[0]?.linkedin);
        }
    }, [data]);

    if(isFetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className='py-5 bg-slate-100'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your business address"
                                    className='py-5 bg-slate-100'
                                    {...field}
                                />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter a brief description about your business or services"
                                    className="resize-none bg-slate-100"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-3">
                    <h2 className="text-lg font-medium">Social Media Links</h2>

                    <FormField
                        control={form.control}
                        name="link1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Facebook Link</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="Enter your Facebook link"
                                        className='py-5 bg-slate-100'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>LinkedIn Link</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="Enter your LinkedIn link"
                                        className='py-5 bg-slate-100'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link3"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Twitter(X) Link</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="Enter your Twitter(X) link"
                                        className='py-5 bg-slate-100'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button disabled={isLoading} type="submit" className="w-full">
                    Save Changes {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
            </form>
        </Form>
    );
}
