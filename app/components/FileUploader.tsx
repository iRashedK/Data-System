"use client"

import type React from "react"
import { useState, useRef } from "react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file)
      } else {
        alert("Please upload an Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file)
      } else {
        alert("Please upload an Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleChange} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-600">
            Drag and drop your Excel file here, or{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-800 font-medium underline"
              onClick={openFileSelector}
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">Supports .xlsx and .xls files (max 10MB)</p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-6 text-green-500 mr-2">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-medium truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-gray-500 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedFile(null)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
            onClick={handleSubmit}
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Analyze File
          </button>
        </div>
      )}
    </div>
  )
}
