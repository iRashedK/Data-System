"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, FileText, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast" // Assuming you have this hook

interface FileUploaderProps {
  onFileUpload: (file: File) => void // Callback when a file is ready to be processed
  // Add other props like accepted file types, max size, etc. if needed
  acceptedFileTypes?: string // e.g., ".xlsx,.xls,.csv"
  maxFileSizeMB?: number
}

export function FileUploader({
  onFileUpload,
  acceptedFileTypes = ".xlsx,.xls,.csv", // Default to common data files
  maxFileSizeMB = 10, // Default max size
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileValidation = (file: File): boolean => {
    if (maxFileSizeMB && file.size > maxFileSizeMB * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `File size cannot exceed ${maxFileSizeMB}MB.`,
      })
      return false
    }
    // Basic type check based on extension. More robust checks might be needed.
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (acceptedFileTypes && !acceptedFileTypes.split(",").includes(fileExtension!)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Please upload a file of type: ${acceptedFileTypes}.`,
      })
      return false
    }
    return true
  }

  const processFile = (file: File) => {
    if (handleFileValidation(file)) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null) // Clear if validation fails
    }
  }

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
      // Optionally clear the selected file after submission
      // setSelectedFile(null);
    } else {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
      })
    }
  }

  const openFileSelector = () => {
    inputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data File</CardTitle>
        <CardDescription>
          Upload an Excel (.xlsx, .xls) or CSV (.csv) file for classification. Max size: {maxFileSizeMB}MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} onDragEnter={handleDrag} className="space-y-4">
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md
                        ${dragActive ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground/50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
            <Input ref={inputRef} type="file" className="hidden" accept={acceptedFileTypes} onChange={handleChange} />
            <p className="text-muted-foreground">
              <Button type="button" variant="link" onClick={openFileSelector} className="p-0 h-auto">
                Click to upload
              </Button>{" "}
              or drag and drop.
            </p>
            <p className="text-xs text-muted-foreground">{acceptedFileTypes.replace(/\./g, "").toUpperCase()}</p>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} className="h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button type="button" onClick={handleSubmit} disabled={!selectedFile} className="w-full">
            Process File
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
