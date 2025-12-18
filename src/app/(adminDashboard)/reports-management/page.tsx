import React from 'react'
import ReportsManagementTable from './_components/ReportsManagementTable'

export default function ReportManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">

            <h1 className="text-[#000000] text-xl font-medium py-3 px-2 mb-2">
                Reports Generated
            </h1>

            <ReportsManagementTable />
        </div>
    )
}
