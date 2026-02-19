import React from "react";
import { ContactUsForm } from "./_components/ContactUsForm";

export default function ContactUsManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-6">
            <h1 className="text-[#000000] text-2xl font-semibold mb-6">
                Contact Us Management
            </h1>
            <ContactUsForm />
        </div>
    );
}
