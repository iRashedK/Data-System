"use client"

import type React from "react"
import { useMemo } from "react"
import type { ClassificationResult, TableClassification } from "../types"
import { ClassificationCard } from "./ClassificationCard"
import { ClassificationChart } from "./ClassificationChart"
import { KpiCards } from "./KpiCards"
import { TableClassificationCard } from "./TableClassificationCard"

interface DashboardProps {
  results: ClassificationResult[]
  tableClassification: TableClassification
}

export const Dashboard: React.FC<DashboardProps> = ({ results, tableClassification }) => {
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

  const exportToJSON = () => {
    const exportData = {
      tableClassification,
      columnClassifications: results,
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${tableClassification.tableName}_classification_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const headers = ["Column", "Classification", "Justification", "Description"]
    const csvContent = [
      headers.join(","),
      ...results.map((result) =>
        [
          `"${result.column}"`,
          `"${result.classification}"`,
          `"${result.justification}"`,
          `"${result.description || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${tableClassification.tableName}_classification_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Classification Results</h2>

      <TableClassificationCard tableClassification={tableClassification} />

      <KpiCards kpiData={kpiData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Classification Distribution</h3>
          <ClassificationChart data={kpiData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Total Columns:</span>
                <p className="text-2xl font-bold text-gray-800">{results.length}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Sensitive Data:</span>
                <p className="text-2xl font-bold text-red-600">{kpiData["Top Secret"] + kpiData["Confidential"]}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className="font-medium text-gray-600">Risk Level:</span>
              <div className="mt-2">
                {tableClassification.riskLevel === "High" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    🔴 High Risk
                  </span>
                ) : tableClassification.riskLevel === "Medium" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    🟡 Medium Risk
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    🟢 Low Risk
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={exportToJSON}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm"
              >
                Export JSON
              </button>
              <button
                onClick={exportToCSV}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm"
              >
                Export CSV
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
