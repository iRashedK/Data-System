"use client"

import Layout from "@/app/components/layout/Layout" // Corrected: Default import
import { KpiCards } from "@/app/components/KpiCards"
import { ClassificationChart } from "@/app/components/ClassificationChart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// Mock data for KpiCards component
const classificationKpiData = {
  "Top Secret": 187,
  Confidential: 342,
  Restricted: 519,
  Public: 200,
}

// Mock data for ClassificationChart component
const chartData = [
  { name: "Public", value: 200, fill: "#3b82f6" },
  { name: "Restricted", value: 519, fill: "#eab308" },
  { name: "Confidential", value: 342, fill: "#f97316" },
  { name: "Top Secret", value: 187, fill: "#ef4444" },
]

const recentActivityData = [
  {
    id: 1,
    type: "classification",
    description: "Classified 'Sales Report Q4'.",
    timestamp: "2 hours ago",
    user: "Ali Ahmed",
  },
  {
    id: 2,
    type: "catalog_update",
    description: "Updated metadata for 'Customer Demographics'.",
    timestamp: "5 hours ago",
    user: "Fatima Khan",
  },
  {
    id: 3,
    type: "report_generated",
    description: "Generated 'Compliance Overview Q1'.",
    timestamp: "1 day ago",
    user: "System",
  },
]

export default function DashboardPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
          <Link href="/classification">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Classification
            </Button>
          </Link>
        </div>

        <KpiCards kpiData={classificationKpiData} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <ClassificationChart data={chartData} />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentActivityData.map((activity) => (
                    <li key={activity.id} className="text-sm border-b pb-2">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        By {activity.user} - {activity.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
