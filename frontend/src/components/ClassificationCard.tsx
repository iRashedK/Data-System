import type React from "react"
import type { ClassificationResult } from "../types"

interface ClassificationCardProps {
  result: ClassificationResult
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ result }) => {
  const getBadgeColor = (classification: string) => {
    switch (classification) {
      case "Top Secret":
        return "bg-red-100 text-red-800 border-red-200"
      case "Confidential":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Restricted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Public":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getIcon = (classification: string) => {
    switch (classification) {
      case "Top Secret":
        return "🔴"
      case "Confidential":
        return "🟠"
      case "Restricted":
        return "🟡"
      case "Public":
        return "🔵"
      default:
        return "⚪"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-800 truncate" title={result.column}>
            {result.column}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(result.classification)}`}
          >
            {getIcon(result.classification)} {result.classification}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">{result.justification}</p>
        </div>
      </div>
    </div>
  )
}
