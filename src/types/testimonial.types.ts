// Testimonial related types

export interface ITestimonial {
    id: string;
    clientName: string;
    designation: string;
    clientPhoto: string;
    description: string;
    rating: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ITestimonialMeta {
    page: number;
    limit: number;
    total: number;
}

export interface ITestimonialsResponse {
    success: boolean;
    message: string;
    data: {
        data: ITestimonial[];
        meta: ITestimonialMeta;
    };
}

export interface ISingleTestimonialResponse {
    success: boolean;
    message: string;
    data: ITestimonial;
}

export interface ITestimonialQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}
