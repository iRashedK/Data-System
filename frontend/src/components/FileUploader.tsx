"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FiUpload, FiFile } from "react-icons/fi"

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
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleChange} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <FiUpload className="h-12 w-12 text-gray-400" />
          <p className="text-lg text-gray-600">
            Drag and drop your Excel file here, or{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-800 font-medium"
              onClick={openFileSelector}
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">Supports .xlsx and .xls files</p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <FiFile className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-gray-700 truncate flex-1">{selectedFile.name}</span>
            <span className="text-gray-500 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</span>
          </div>

          <button
            type="button"
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            onClick={handleSubmit}
          >
            Analyze File
          </button>
        </div>
      )}
    </div>
  )
}
