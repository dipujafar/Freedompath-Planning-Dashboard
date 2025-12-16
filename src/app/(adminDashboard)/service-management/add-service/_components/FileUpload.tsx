"use client"
import type React from "react"
import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors hover:border-muted-foreground/50 hover:bg-accent/50  border-[#E1E1E1] bg-[#F9FAFB] py-5"
    >
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {preview ? (
        <>
          <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full rounded-lg object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Upload your image</p>
            <p className="text-xs text-muted-foreground">Drag and drop or browse to choose a file</p>
          </div>
        </div>
      )}
    </div>
  )
}
