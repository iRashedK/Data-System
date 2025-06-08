"use client"

import { useState } from "react"
import { FileUploader } from "./components/FileUploader"
import { Dashboard } from "./components/Dashboard"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import type { ClassificationResult } from "./types"
import { ConnectionTest } from "./components/ConnectionTest"

function App() {
  const [results, setResults] = useState<ClassificationResult[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)

    // First, test if the backend is reachable
    try {
      const apiUrl = "http://localhost:8000"

      // Test backend connection first
      const healthResponse = await fetch(`${apiUrl}/health`, {
        method: "GET",
        mode: "cors",
      })

      if (!healthResponse.ok) {
        throw new Error("Backend server is not responding. Please start the backend server.")
      }
    } catch (healthError) {
      setError("Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const apiUrl = "http://localhost:8000"
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
        mode: "cors",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      console.error("Upload error:", err)
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Network error: Cannot connect to the server. Please ensure the backend is running on http://localhost:8000",
        )
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      }
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Saudi Data Classification System</h1>

        <ConnectionTest />

        <FileUploader onFileUpload={handleFileUpload} />

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {results && <Dashboard results={results} />}
      </main>
      <Footer />
    </div>
  )
}

export default App
