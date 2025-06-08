import type React from "react"
import type { ClassificationResult } from "../types"

interface ClassificationCardProps {
  result: ClassificationResult
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ result }) => {
  const getBadgeColor = (classification: string) => {
    switch (classification) {
      case "سري للغاية":
        return "bg-red-100 text-red-800 border-red-200"
      case "سري":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "مقيد":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "عام":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getIcon = (classification: string) => {
    switch (classification) {
      case "سري للغاية":
        return "🔴"
      case "سري":
        return "🟠"
      case "مقيد":
        return "🟡"
      case "عام":
        return "🔵"
      default:
        return "⚪"
    }
  }

  const getImpactBadgeColor = (impactLevel: string) => {
    switch (impactLevel) {
      case "عالي":
        return "bg-red-50 text-red-700 border-red-200"
      case "متوسط":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "منخفض":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-800 truncate pr-2" title={result.column}>
            {result.column}
          </h3>
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(
                result.classification,
              )}`}
            >
              {getIcon(result.classification)} {result.classification}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactBadgeColor(
                result.impactLevel,
              )}`}
            >
              أثر {result.impactLevel}
            </span>
          </div>
        </div>

        {result.description && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700 text-right">{result.description}</div>
        )}

        {result.impactCategory.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1 text-right">فئات الأثر:</h4>
            <div className="flex flex-wrap gap-1">
              {result.impactCategory.map((category, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 leading-relaxed pt-2 border-t text-right">{result.justification}</div>
      </div>
    </div>
  )
}
