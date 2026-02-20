"use client";

import { useGetSingleBookQuery } from "@/redux/api/booksApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Book, FileDown, DollarSign, Download } from "lucide-react";
import { Spin } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";

const BookDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const bookId = params.id as string;

    const {
        data: bookData,
        isLoading,
        isError,
    } = useGetSingleBookQuery(bookId, {
        skip: !bookId,
    });

    const book = bookData?.data;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !book) {
        return (
            <div className="min-h-screen bg-background border border-border-color rounded-xl p-6">
                <div className="mb-6 flex items-center gap-2">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Book Details</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <p className="text-lg font-medium">Failed to load book details</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        The book may not exist or there was an error loading the data.
                    </p>
                    <Button
                        onClick={() => router.back()}
                        className="mt-4 bg-main-color hover:bg-secondary-color hover:text-black"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background border border-border-color rounded-xl">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-2">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Book Details</h1>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Cover */}
                    <div className="lg:col-span-1">
                        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border-color bg-section-bg shadow-sm">
                            <Image
                                src={book.image || "/book.png"}
                                alt={book.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/book.png";
                                }}
                            />
                        </div>
                    </div>

                    {/* Book Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <Book className="h-5 w-5 text-main-color" />
                                </div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Book Name
                                </label>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mt-2">
                                {book.name}
                            </h2>
                        </div>

                        {/* Price and Downloads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Price Card */}
                            <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Price
                                        </label>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${book.price}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Downloads Card */}
                            <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Download className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Downloads
                                        </label>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {book.downloads}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Details
                            </label>
                            <div
                                className="text-base text-foreground mt-3 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: book.details }}
                            />
                        </div>

                        {/* Download Link Card */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-main-color/10 rounded-lg">
                                    <FileDown className="h-5 w-5 text-main-color" />
                                </div>
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Download Book
                                </label>
                            </div>
                            <Link
                                href={book.file}
                                target="_blank"
                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-main-color text-white rounded-lg hover:bg-secondary-color hover:text-black transition-colors"
                            >
                                <FileDown className="h-4 w-4" />
                                Download PDF
                            </Link>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Created Date */}
                            <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-main-color/10 rounded-lg">
                                        <Calendar className="h-5 w-5 text-main-color" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Created Date
                                        </label>
                                        <p className="text-base font-medium text-foreground">
                                            {dayjs(book.createdAt).format("DD MMM, YYYY")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-main-color/10 rounded-lg">
                                        <Clock className="h-5 w-5 text-main-color" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Updated
                                        </label>
                                        <p className="text-base font-medium text-foreground">
                                            {dayjs(book.updatedAt).format("DD MMM, YYYY")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="bg-section-bg rounded-2xl border border-border-color p-6">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Status
                            </label>
                            <div className="mt-3">
                                <span
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${book.isDeleted
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${book.isDeleted ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    />
                                    {book.isDeleted ? "Deleted" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
