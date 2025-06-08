"use client"

import type React from "react"
import { useState, useEffect } from "react"

export const ConnectionTest: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [backendInfo, setBackendInfo] = useState<any>(null)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:8000/health", {
        method: "GET",
        mode: "cors",
      })

      if (response.ok) {
        const data = await response.json()
        setBackendStatus("connected")
        setBackendInfo(data)
      } else {
        setBackendStatus("disconnected")
      }
    } catch (error) {
      console.error("Backend connection test failed:", error)
      setBackendStatus("disconnected")
    }
  }

  const getStatusColor = () => {
    switch (backendStatus) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200"
      case "disconnected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
  }

  const getStatusIcon = () => {
    switch (backendStatus) {
      case "connected":
        return "✅"
      case "disconnected":
        return "❌"
      default:
        return "⏳"
    }
  }

  return (
    <div className={`p-4 rounded-lg border mb-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg mr-2">{getStatusIcon()}</span>
          <span className="font-medium">
            Backend Status: {backendStatus === "checking" ? "Checking..." : backendStatus}
          </span>
        </div>
        <button onClick={checkBackendConnection} className="px-3 py-1 text-sm bg-white rounded border hover:bg-gray-50">
          Refresh
        </button>
      </div>

      {backendStatus === "disconnected" && (
        <div className="mt-2 text-sm">
          <p>Cannot connect to backend server.</p>
          <p className="font-medium">To start the backend:</p>
          <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">python backend-standalone.py</code>
        </div>
      )}

      {backendInfo && (
        <div className="mt-2 text-sm">
          <p>API Version: {backendInfo.api_version}</p>
          <p>Message: {backendInfo.message}</p>
        </div>
      )}
    </div>
  )
}
