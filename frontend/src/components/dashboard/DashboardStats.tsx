"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Database } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

interface DashboardStatsProps {
  stats: any
  loading: boolean
}

const COLORS = {
  "Top Secret": "#ef4444",
  Confidential: "#f97316",
  Internal: "#eab308",
  Public: "#3b82f6",
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No data yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload a file or connect a database to get started.
        </p>
      </div>
    )
  }

  const kpiCards = [
    {
      title: "Total Columns",
      value: stats.total_columns,
      icon: Database,
      color: "blue",
      change: "+12%",
    },
    {
      title: "High Risk Fields",
      value: stats.high_risk_fields,
      icon: AlertTriangle,
      color: "red",
      change: "-5%",
    },
    {
      title: "Compliance Score",
      value: `${Math.round(Object.values(stats.compliance_percentages).reduce((a: number, b: number) => a + b, 0) / Object.keys(stats.compliance_percentages).length)}%`,
      icon: Shield,
      color: "green",
      change: "+8%",
    },
    {
      title: "Last Scan",
      value: stats.last_classification_date ? new Date(stats.last_classification_date).toLocaleDateString() : "Never",
      icon: Clock,
      color: "purple",
      change: "Today",
    },
  ]

  const complianceData = Object.entries(stats.compliance_percentages).map(([regulation, percentage]) => ({
    regulation,
    percentage: Math.round(percentage as number),
  }))

  const classificationData = Object.entries(stats.classification_distribution).map(([level, count]) => ({
    level,
    count,
    color: COLORS[level as keyof typeof COLORS],
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data Classification Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your data classification and compliance status</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">All systems operational</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                <p
                  className={`text-sm ${
                    card.change.startsWith("+")
                      ? "text-green-600"
                      : card.change.startsWith("-")
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {card.change}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900`}>
                <card.icon className={`h-6 w-6 text-${card.color}-600 dark:text-${card.color}-400`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Regulation Compliance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="regulation" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Classification Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Classification Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ level, count }) => `${level}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {classificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Classification Activity (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.weekly_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Risk Heatmap */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Assessment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-900 dark:text-red-100">High Risk</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {stats.classification_distribution["Top Secret"] || 0}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">Top Secret fields requiring immediate attention</p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-900 dark:text-yellow-100">Medium Risk</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {stats.classification_distribution["Confidential"] || 0}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Confidential fields requiring protection</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-900 dark:text-green-100">Low Risk</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {(stats.classification_distribution["Internal"] || 0) +
                (stats.classification_distribution["Public"] || 0)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">Internal and Public fields</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
