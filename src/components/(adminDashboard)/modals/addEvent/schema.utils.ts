import * as z from "zod";
export const eventFormSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  eventName: z.string().min(1, "Event name is required"),
  venueName: z.string().min(1, "Venue name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  eventDate: z.date().min(1, "Event date is required"),
  eventDuration: z.string().min(1, "Event duration is required"),
  registrationFee: z.string().min(1, "Registration fee is required"),
  eventWebsite: z.string().email("Invalid email address"),
  images: z.array(z.string()),
  zipCode: z.string().min(1, "Zip code is required"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const eventType = [
  {
    label: "AGF",
    value: "AGF",
  },
  {
    label: "BJJ",
    value: "BJJ",
  },
  {
    label: "NAGA",
    value: "NAGA",
  },
  {
    label: "ADCC",
    value: "ADCC",
  },
  {
    label: "Local",
    value: "Local",
  },
];

export const eventDurationType = [
  {
    label: "1 Day",
    value: "1",
  },
  {
    label: "2 Days",
    value: "2",
  },
  {
    label: "3 Days",
    value: "3",
  },
  {
    label: "4 Days",
    value: "4",
  },
  {
    label: "5 Days",
    value: "5",
  },
  {
    label: "6 Days",
    value: "6",
  },
  {
    label: "7 Days",
    value: "7",
  },
];
