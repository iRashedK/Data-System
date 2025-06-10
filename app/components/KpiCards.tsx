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
  // Add a guard clause to handle cases where kpiData might still be undefined during render cycles
  if (!kpiData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* You can return skeleton loaders here for a better UX */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-muted h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Top Secret",
      value: kpiData["Top Secret"],
      icon: "🔴",
      color: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50",
      description: "Highly sensitive data",
    },
    {
      title: "Confidential",
      value: kpiData["Confidential"],
      icon: "🟠",
      color:
        "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50",
      description: "Sensitive data",
    },
    {
      title: "Restricted",
      value: kpiData["Restricted"],
      icon: "🟡",
      color:
        "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50",
      description: "Protected data",
    },
    {
      title: "Public",
      value: kpiData["Public"],
      icon: "🔵",
      color: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50",
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
              <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-1">{card.description}</p>
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
