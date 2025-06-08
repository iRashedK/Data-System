"use client"

import type React from "react"

import { useState } from "react"

interface ClassificationSettingsProps {
  onSettingsChange: (settings: {
    useAI: boolean
    apiKey: string
    sampleSize: number
  }) => void
  isOpen: boolean
  onClose: () => void
}

export const ClassificationSettings: React.FC<ClassificationSettingsProps> = ({
  onSettingsChange,
  isOpen,
  onClose,
}) => {
  const [useAI, setUseAI] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [sampleSize, setSampleSize] = useState(10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSettingsChange({
      useAI,
      apiKey,
      sampleSize,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Classification Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Use AI for classification (OpenRouter)</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              AI classification provides more accurate results but requires an API key
            </p>
          </div>

          {useAI && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">OpenRouter API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="sk-or-v1-..."
                required={useAI}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get an API key from{" "}
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  openrouter.ai
                </a>
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Size <span className="text-gray-500">({sampleSize} rows)</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Number of rows to sample from each column for classification</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
