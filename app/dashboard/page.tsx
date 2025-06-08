"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Layout } from "@/components/layout/Layout"
import { Shield, AlertTriangle, FileText, Globe } from "lucide-react"

// Sample data
const classificationData = {
  totalFields: 1248,
  topSecret: 187,
  confidential: 342,
  internal: 519,
  public: 200,
  complianceScore: 87,
  reclassificationNeeded: 42,
  publicDataPercentage: 16,
}

const complianceData = [
  { name: "NDMO", score: 92 },
  { name: "PDPL", score: 87 },
  { name: "GDPR", score: 79 },
  { name: "NCA", score: 85 },
  { name: "DAMA", score: 91 },
]

const trendData = [
  { date: "Jan", compliance: 75, fields: 800 },
  { date: "Feb", compliance: 78, fields: 950 },
  { date: "Mar", compliance: 80, fields: 1000 },
  { date: "Apr", compliance: 83, fields: 1050 },
  { date: "May", compliance: 85, fields: 1150 },
  { date: "Jun", compliance: 87, fields: 1248 },
]

const pieData = [
  { name: "Top Secret", value: classificationData.topSecret, color: "#ef4444" },
  { name: "Confidential", value: classificationData.confidential, color: "#f97316" },
  { name: "Internal", value: classificationData.internal, color: "#eab308" },
  { name: "Public", value: classificationData.public, color: "#3b82f6" },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your data classification and compliance status</p>
          </div>
          <Tabs defaultValue="6m" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="24h" onClick={() => setTimeRange("24h")}>
                24h
              </TabsTrigger>
              <TabsTrigger value="7d" onClick={() => setTimeRange("7d")}>
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" onClick={() => setTimeRange("30d")}>
                30d
              </TabsTrigger>
              <TabsTrigger value="6m" onClick={() => setTimeRange("6m")}>
                6m
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fields Scanned</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classificationData.totalFields.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+248 from last month</p>
              <Progress value={100} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classificationData.complianceScore}%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
              <Progress value={classificationData.complianceScore} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reclassification Needed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classificationData.reclassificationNeeded}</div>
              <p className="text-xs text-muted-foreground">-8 from last month</p>
              <Progress
                value={(classificationData.reclassificationNeeded / classificationData.totalFields) * 100}
                className="h-1 mt-2"
                variant="destructive"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Data</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classificationData.publicDataPercentage}%</div>
              <p className="text-xs text-muted-foreground">Suitable for open datasets</p>
              <Progress value={classificationData.publicDataPercentage} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Compliance Over Time</CardTitle>
              <CardDescription>Compliance score and fields scanned over {timeRange}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="fields"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Fields Scanned"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="compliance"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Compliance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Classification Distribution</CardTitle>
              <CardDescription>Breakdown of data classification levels</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} fields`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Breakdown</CardTitle>
            <CardDescription>Compliance scores across different regulations</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Compliance"]} />
                <Bar
                  dataKey="score"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", formatter: (value) => `${value}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
