"use client"

import type React from "react"

import { useMemo } from "react"
import type { ClassificationResult } from "../types"
import { ClassificationCard } from "./ClassificationCard"
import { ClassificationChart } from "./ClassificationChart"
import { KpiCards } from "./KpiCards"

interface DashboardProps {
  results: ClassificationResult[]
}

export const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  const kpiData = useMemo(() => {
    const counts = {
      "Top Secret": 0,
      Confidential: 0,
      Restricted: 0,
      Public: 0,
    }

    results.forEach((result) => {
      if (counts.hasOwnProperty(result.classification)) {
        counts[result.classification as keyof typeof counts]++
      }
    })

    return counts
  }, [results])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Classification Results</h2>

      <KpiCards kpiData={kpiData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Classification Distribution</h3>
          <ClassificationChart data={kpiData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Summary</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium">Total Columns Analyzed:</span> {results.length}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Sensitive Data Columns:</span>{" "}
              {kpiData["Top Secret"] + kpiData["Confidential"]}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Percentage of Sensitive Data:</span>{" "}
              {(((kpiData["Top Secret"] + kpiData["Confidential"]) / results.length) * 100).toFixed(1)}%
            </p>
            <div className="mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mr-3">
                Export Results (JSON)
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                Export Results (Excel)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Column Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, index) => (
            <ClassificationCard key={index} result={result} />
          ))}
        </div>
      </div>
    </div>
  )
}
