"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Upload, X, CheckCircle, AlertTriangle } from "lucide-react"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
      }
    },
  })

  const handleUpload = () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadStatus("success")
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleCancel = () => {
    setFile(null)
    setUploading(false)
    setUploadProgress(0)
    setUploadStatus("idle")
  }

  return (
    <Card className="p-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse (supports Excel and CSV files)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-2">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && (
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>File uploaded successfully! Processing data...</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span>Error uploading file. Please try again.</span>
            </div>
          )}

          {uploadStatus === "idle" && (
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload & Classify</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
