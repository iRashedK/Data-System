"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Upload, Database, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

export function UploadSection() {
  const [uploadMode, setUploadMode] = useState<"file" | "database">("file")
  const [dbConnection, setDbConnection] = useState({
    name: "",
    type: "postgresql",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  })

  const queryClient = useQueryClient()

  const fileUploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadFile(file),
    onSuccess: () => {
      toast.success("File uploaded and classified successfully!")
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["classification-results"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Upload failed")
    },
  })

  const dbConnectMutation = useMutation({
    mutationFn: (connectionData: any) => api.connectDatabase(connectionData),
    onSuccess: () => {
      toast.success("Database connected and classified successfully!")
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["classification-results"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Database connection failed")
    },
  })

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (files) => {
      if (files.length > 0) {
        fileUploadMutation.mutate(files[0])
      }
    },
  })

  const handleDatabaseConnect = () => {
    const connectionString = `${dbConnection.type}://${dbConnection.username}:${dbConnection.password}@${dbConnection.host}:${dbConnection.port}/${dbConnection.database}`

    dbConnectMutation.mutate({
      name: dbConnection.name,
      type: "database",
      connection_string: connectionString,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upload & Connect</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload files or connect to databases for AI-powered data classification
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-4">
        <Button
          variant={uploadMode === "file" ? "primary" : "secondary"}
          onClick={() => setUploadMode("file")}
          className="flex items-center space-x-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>File Upload</span>
        </Button>
        <Button
          variant={uploadMode === "database" ? "primary" : "secondary"}
          onClick={() => setUploadMode("database")}
          className="flex items-center space-x-2"
        >
          <Database className="h-4 w-4" />
          <span>Database Connection</span>
        </Button>
      </div>

      {uploadMode === "file" ? (
        <Card className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <input {...getInputProps()} />

            {fileUploadMutation.isPending ? (
              <div className="space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Processing file...</p>
                <p className="text-gray-600 dark:text-gray-400">AI is analyzing and classifying your data</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {isDragActive ? "Drop your file here" : "Upload Excel or CSV file"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop or click to select (.xlsx, .xls, .csv)
                  </p>
                </div>

                {acceptedFiles.length > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>{acceptedFiles[0].name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Supported formats:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Excel files (.xlsx, .xls) - up to 100MB</li>
                  <li>CSV files (.csv) - up to 100MB</li>
                  <li>Files are processed locally and securely</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Database Connection</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Connection Name</label>
              <Input
                value={dbConnection.name}
                onChange={(e) => setDbConnection({ ...dbConnection, name: e.target.value })}
                placeholder="My Database"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database Type</label>
              <select
                value={dbConnection.type}
                onChange={(e) => setDbConnection({ ...dbConnection, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlserver">SQL Server</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host</label>
              <Input
                value={dbConnection.host}
                onChange={(e) => setDbConnection({ ...dbConnection, host: e.target.value })}
                placeholder="localhost"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
              <Input
                value={dbConnection.port}
                onChange={(e) => setDbConnection({ ...dbConnection, port: e.target.value })}
                placeholder="5432"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database Name</label>
              <Input
                value={dbConnection.database}
                onChange={(e) => setDbConnection({ ...dbConnection, database: e.target.value })}
                placeholder="mydb"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <Input
                value={dbConnection.username}
                onChange={(e) => setDbConnection({ ...dbConnection, username: e.target.value })}
                placeholder="username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input
                type="password"
                value={dbConnection.password}
                onChange={(e) => setDbConnection({ ...dbConnection, password: e.target.value })}
                placeholder="password"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleDatabaseConnect}
              disabled={dbConnectMutation.isPending || !dbConnection.name || !dbConnection.host}
              className="flex items-center space-x-2"
            >
              {dbConnectMutation.isPending ? <LoadingSpinner size="sm" /> : <Database className="h-4 w-4" />}
              <span>Connect & Classify</span>
            </Button>
          </div>

          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Security Notice:</p>
                <p className="mt-1">
                  Database credentials are used only for schema analysis and are not stored permanently. Ensure your
                  database user has read-only permissions.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
