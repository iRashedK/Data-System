"use client"

import { useState } from "react"
import { FileUploader } from "./components/FileUploader"
import { Dashboard } from "./components/Dashboard"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { ClassificationSettings } from "./components/ClassificationSettings"
import type { ClassificationResult, TableClassification } from "./types"
import { generateTableClassification } from "./utils/table-classification"
import { classifyDataAccordingToSaudiPolicy } from "./utils/saudi-classification"

export default function Page() {
  const [results, setResults] = useState<ClassificationResult[] | null>(null)
  const [tableClassification, setTableClassification] = useState<TableClassification | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [settings, setSettings] = useState({
    useAI: false,
    apiKey: "",
    sampleSize: 10,
  })

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      // Extract table name from file name
      const tableName = file.name.replace(/\.[^/.]+$/, "") // Remove file extension

      // Read the Excel file using FileReader
      const arrayBuffer = await file.arrayBuffer()

      // Import XLSX library dynamically
      const XLSX = await import("xlsx")

      // Parse the Excel file
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length === 0) {
        throw new Error("ملف Excel فارغ")
      }

      // Get column headers (first row)
      const headers = jsonData[0] as string[]

      if (!headers || headers.length === 0) {
        throw new Error("لم يتم العثور على رؤوس الأعمدة في ملف Excel")
      }

      // Get sample data for each column
      const sampleData: { [key: string]: any[] } = {}
      headers.forEach((header, index) => {
        if (header) {
          sampleData[header] = []
          // Get first N non-empty values for this column
          for (let row = 1; row < Math.min(jsonData.length, settings.sampleSize + 1); row++) {
            const value = (jsonData[row] as any[])?.[index]
            if (value !== undefined && value !== null && value !== "") {
              sampleData[header].push(value)
            }
          }
        }
      })

      // Classify each column using Saudi policy
      const classificationResults: ClassificationResult[] = []

      headers.forEach((header) => {
        if (header && header.trim()) {
          const result = classifyDataAccordingToSaudiPolicy(header, sampleData[header] || [])
          classificationResults.push(result)
        }
      })

      if (classificationResults.length === 0) {
        throw new Error("لم يتم العثور على أعمدة صالحة للتصنيف")
      }

      // Generate table-level classification (المبدأ الرابع: المستوى الأعلى من الحماية)
      const tableClass = generateTableClassification(tableName, classificationResults)

      setResults(classificationResults)
      setTableClassification(tableClass)
    } catch (err) {
      console.error("File processing error:", err)
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الملف")
      setResults(null)
      setTableClassification(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onSettingsClick={() => setSettingsOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">نظام تصنيف البيانات السعودي</h1>
        <p className="text-center text-gray-600 mb-8">
          وفقاً لسياسة تصنيف البيانات الصادرة عن المكتب الوطني لإدارة البيانات
        </p>

        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="text-lg mr-2">✅</span>
            <span className="font-medium">حالة النظام: جاهز (تصنيف وفقاً للسياسة السعودية)</span>
          </div>
          <p className="text-sm mt-1">يتم معالجة الملفات محلياً في المتصفح لضمان أقصى درجات الأمان والخصوصية.</p>
        </div>

        <FileUploader onFileUpload={handleFileUpload} />

        {loading && (
          <div className="flex flex-col items-center justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">جاري معالجة ملف Excel وتصنيف البيانات...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
            <strong className="font-bold">خطأ: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {results && tableClassification && <Dashboard results={results} tableClassification={tableClassification} />}
      </main>
      <Footer />

      <ClassificationSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}
