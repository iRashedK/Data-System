"use client"

import type React from "react"

interface ChartProps {
  data: {
    "Top Secret": number
    Confidential: number
    Restricted: number
    Public: number
  }
}

export const ClassificationChart: React.FC<ChartProps> = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)

  const chartData = [
    { name: "Top Secret", value: data["Top Secret"], color: "#EF4444", percentage: (data["Top Secret"] / total) * 100 },
    {
      name: "Confidential",
      value: data["Confidential"],
      color: "#F97316",
      percentage: (data["Confidential"] / total) * 100,
    },
    { name: "Restricted", value: data["Restricted"], color: "#EAB308", percentage: (data["Restricted"] / total) * 100 },
    { name: "Public", value: data["Public"], color: "#3B82F6", percentage: (data["Public"] / total) * 100 },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="space-y-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700">{item.name}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: item.color,
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
            <div className="w-16 text-sm text-gray-600 text-right">
              {item.value} ({item.percentage.toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
