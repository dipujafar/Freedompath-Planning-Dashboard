"use client";
import CountryStateCitySelector from "@/components/ui/CountryStateCitySelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),

  city: z.string().min(1, "Please select a city"),
  state: z.string().min(1, "Please select a state"),
});

type FormData = z.infer<typeof formSchema>;

export default function FilterOptions() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "United States",
      city: "",
      state: "",
    },
  });

  const { register, setValue, control } = form;
  return (
    <div className="flex items-center">
      <div className="w-full xl:w-1/2">
        <CountryStateCitySelector
          control={control}
          setValue={setValue}
          register={register}
          userAddress={{ country: "United States" }}
        />
      </div>
      <div className="max-w-[400px] ml-auto mb-2 pt-2 w-full">
        <Input.Search placeholder="Search here..." size="large" />
      </div>
    </div>
  );
}
