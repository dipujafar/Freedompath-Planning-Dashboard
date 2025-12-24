// Dashboard related types

export interface IDashboardCards {
    totalViewers: number;
    totalDownloads: number;
    totalReports: number;
}

export interface IDashboardCardsResponse {
    success: boolean;
    message: string;
    data: IDashboardCards;
}

export interface IDashboardChartItem {
    month: number;
    total: number;
}

export interface IDashboardChartResponse {
    success: boolean;
    message: string;
    data: IDashboardChartItem[];
}

// Dashboard service item
export interface IDashboardService {
    id: string;
    serviceName: string;
    subTitle: string;
    image: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    whatYourClientGets?: {
        id: string;
        serviceId: string;
        image: string;
        createdAt: string;
        updatedAt: string;
        options: Array<{
            id: string;
            title: string;
            subTitle: string;
            createdAt: string;
            updatedAt: string;
            parentId: string;
        }>;
    };
    includedServices?: unknown[];
}

export interface IDashboardServicesResponse {
    success: boolean;
    message: string;
    data: {
        data: IDashboardService[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    };
}
