import type React from "react"

interface KpiCardsProps {
  kpiData: {
    "Top Secret": number
    Confidential: number
    Restricted: number
    Public: number
  }
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpiData }) => {
  const cards = [
    {
      title: "Top Secret",
      value: kpiData["Top Secret"],
      icon: "🔴",
      color: "bg-red-50 text-red-700 border-red-100",
      description: "Highly sensitive data",
    },
    {
      title: "Confidential",
      value: kpiData["Confidential"],
      icon: "🟠",
      color: "bg-orange-50 text-orange-700 border-orange-100",
      description: "Sensitive data",
    },
    {
      title: "Restricted",
      value: kpiData["Restricted"],
      icon: "🟡",
      color: "bg-yellow-50 text-yellow-700 border-yellow-100",
      description: "Protected data",
    },
    {
      title: "Public",
      value: kpiData["Public"],
      icon: "🔵",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Publicly shareable",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.title} className={`p-4 rounded-lg border ${card.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs opacity-75 mt-1">{card.description}</p>
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
