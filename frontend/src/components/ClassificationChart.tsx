import type React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ChartProps {
  data: {
    "Top Secret": number
    Confidential: number
    Restricted: number
    Public: number
  }
}

export const ClassificationChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = [
    { name: "Top Secret", value: data["Top Secret"], color: "#EF4444" },
    { name: "Confidential", value: data["Confidential"], color: "#F97316" },
    { name: "Restricted", value: data["Restricted"], color: "#EAB308" },
    { name: "Public", value: data["Public"], color: "#3B82F6" },
  ].filter((item) => item.value > 0)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} columns`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
