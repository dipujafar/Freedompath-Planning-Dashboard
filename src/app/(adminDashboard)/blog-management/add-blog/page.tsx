import React from 'react'
import AddBlogForm from './_components/AddBlogForm'

export default function BlogManagementPage() {
    return (
        <div className="bg-section-bg min-h-[calc(100vh-150px)] rounded-xl border border-border-color p-4">
            <AddBlogForm />
        </div>
    )
}
