"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    useGetHeroButtonsQuery,
    useAddHeroButtonMutation,
    useUpdateHeroButtonMutation,
    useDeleteHeroButtonMutation,
} from "@/redux/api/homePageApi";

const buttonSchema = z.object({
    title: z.string().min(1, "Button title is required"),
    link: z.string().min(1, "Link is required"),
});

type ButtonFormValues = z.infer<typeof buttonSchema>;

interface HeroButton {
    id: string;
    index: number;
    title: string;
    link: string;
}

function AddButtonForm({ onSuccess }: { onSuccess: () => void }) {
    const [addHeroButton, { isLoading }] = useAddHeroButtonMutation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ButtonFormValues>({
        resolver: zodResolver(buttonSchema),
    });

    const onSubmit = async (values: ButtonFormValues) => {
        try {
            await addHeroButton({
                index: 1,
                title: values.title,
                link: values.link,
            }).unwrap();
            toast.success("Button added successfully!");
            reset();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add button");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border border-dashed border-[#E1E1E1] rounded-lg bg-[#F9FAFB] space-y-4">
            <p className="text-sm font-semibold text-gray-700">Add New Button</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Button Title</Label>
                    <Input placeholder="e.g. Get Started" className="bg-white border-[#E1E1E1]" {...register("title")} />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Link</Label>
                    <Input placeholder="/contact" className="bg-white border-[#E1E1E1]" {...register("link")} />
                    {errors.link && <p className="text-xs text-destructive">{errors.link.message}</p>}
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-main-color text-white hover:bg-main-color/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : <><Plus className="mr-2 h-4 w-4" />Add Button</>}
                </Button>
            </div>
        </form>
    );
}

function EditButtonRow({ button, onCancel }: { button: HeroButton; onCancel: () => void }) {
    const [updateHeroButton, { isLoading }] = useUpdateHeroButtonMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<ButtonFormValues>({
        resolver: zodResolver(buttonSchema),
        defaultValues: { title: button.title, link: button.link },
    });

    const onSubmit = async (values: ButtonFormValues) => {
        try {
            await updateHeroButton({
                id: button.id,
                data: {
                    key: "main",
                    index: button.index,
                    title: values.title,
                    link: values.link,
                },
            }).unwrap();
            toast.success("Button updated successfully!");
            onCancel();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update button");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-3 p-4 border border-main-color/30 rounded-lg bg-[#F9FAFB]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <div className="space-y-1">
                    <Label className="text-xs">Button Title</Label>
                    <Input className="bg-white border-[#E1E1E1] h-9 text-sm" {...register("title")} />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Link</Label>
                    <Input className="bg-white border-[#E1E1E1] h-9 text-sm" {...register("link")} />
                    {errors.link && <p className="text-xs text-destructive">{errors.link.message}</p>}
                </div>
            </div>
            <div className="flex gap-2 mt-5">
                <Button type="submit" size="icon" disabled={isLoading} className="h-9 w-9 bg-green-600 hover:bg-green-700 text-white">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={onCancel} className="h-9 w-9 hover:bg-gray-100">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}

export default function HeroButtonsForm() {
    const { data: heroButtonsData, isLoading } = useGetHeroButtonsQuery();
    const [deleteHeroButton] = useDeleteHeroButtonMutation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const buttons: HeroButton[] = heroButtonsData?.data?.data || [];

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteHeroButton(id).unwrap();
            toast.success("Button deleted successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete button");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-800">Hero Buttons</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage CTA buttons displayed in the hero section</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {buttons.length} button{buttons.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Existing Buttons List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : buttons.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-6 border border-dashed border-[#E1E1E1] rounded-lg">
                    No buttons yet. Add your first CTA button below.
                </p>
            ) : (
                <div className="space-y-3">
                    {buttons.map((btn, i) => (
                        editingId === btn.id ? (
                            <EditButtonRow
                                key={btn.id}
                                button={btn}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div key={btn.id} className="flex items-center justify-between p-4 border border-[#E1E1E1] rounded-lg bg-[#F9FAFB] group">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-main-color/10 text-main-color text-xs font-semibold">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{btn.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{btn.link}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setEditingId(btn.id)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(btn.id)}
                                        disabled={deletingId === btn.id}
                                    >
                                        {deletingId === btn.id
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <Trash2 className="h-4 w-4" />
                                        }
                                    </Button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Add New Button Form */}
            <AddButtonForm onSuccess={() => { }} />
        </div>
    );
}
