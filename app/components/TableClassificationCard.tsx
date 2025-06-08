import type React from "react"
import type { TableClassification } from "../types"

interface TableClassificationCardProps {
  tableClassification: TableClassification
}

export const TableClassificationCard: React.FC<TableClassificationCardProps> = ({ tableClassification }) => {
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

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "⚠️"
      case "Medium":
        return "⚠"
      case "Low":
        return "✓"
      default:
        return "?"
    }
  }

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "مخاطر عالية"
      case "Medium":
        return "مخاطر متوسطة"
      case "Low":
        return "مخاطر منخفضة"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 mb-8">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{tableClassification.tableName}</h2>
            <p className="text-gray-600 mt-1">
              {tableClassification.columnCount} عمود ({tableClassification.sensitiveColumnCount} عمود حساس)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(
                tableClassification.classification,
              )}`}
            >
              {getIcon(tableClassification.classification)} {tableClassification.classification}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeColor(
                tableClassification.riskLevel,
              )}`}
            >
              {getRiskIcon(tableClassification.riskLevel)} {getRiskText(tableClassification.riskLevel)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">مبرر التصنيف</h3>
          <p className="text-gray-700 text-right leading-relaxed">{tableClassification.justification}</p>
        </div>

        {/* Impact Assessment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div
            className={`p-3 rounded-lg border ${
              tableClassification.impactAssessment.nationalInterest
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{tableClassification.impactAssessment.nationalInterest ? "⚠️" : "✓"}</div>
              <div className="text-xs font-medium">المصالح الوطنية</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              tableClassification.impactAssessment.organizationalActivities
                ? "bg-orange-50 border-orange-200 text-orange-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">
                {tableClassification.impactAssessment.organizationalActivities ? "⚠️" : "✓"}
              </div>
              <div className="text-xs font-medium">أنشطة الجهات</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              tableClassification.impactAssessment.individualSafety
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{tableClassification.impactAssessment.individualSafety ? "⚠️" : "✓"}</div>
              <div className="text-xs font-medium">سلامة الأفراد</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              tableClassification.impactAssessment.environmentalResources
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">
                {tableClassification.impactAssessment.environmentalResources ? "⚠️" : "✓"}
              </div>
              <div className="text-xs font-medium">الموارد البيئية</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  tableClassification.classification === "سري للغاية"
                    ? "bg-red-600"
                    : tableClassification.classification === "سري"
                      ? "bg-orange-500"
                      : tableClassification.classification === "مقيد"
                        ? "bg-yellow-400"
                        : "bg-blue-500"
                }`}
                style={{
                  width: `${(tableClassification.sensitiveColumnCount / tableClassification.columnCount) * 100}%`,
                }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {Math.round((tableClassification.sensitiveColumnCount / tableClassification.columnCount) * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">نسبة الأعمدة الحساسة</p>
        </div>
      </div>
    </div>
  )
}
