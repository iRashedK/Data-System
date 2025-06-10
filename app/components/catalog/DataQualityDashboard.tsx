"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface DataQualityDashboardProps {
  datasets: any[]
}

export function DataQualityDashboard({ datasets }: DataQualityDashboardProps) {
  const qualityMetrics = [
    {
      name: "Completeness",
      score: 94,
      trend: "up",
      description: "Percentage of non-null values",
      issues: 2,
    },
    {
      name: "Accuracy",
      score: 87,
      trend: "down",
      description: "Data correctness validation",
      issues: 5,
    },
    {
      name: "Consistency",
      score: 91,
      trend: "up",
      description: "Format and value consistency",
      issues: 3,
    },
    {
      name: "Timeliness",
      score: 96,
      trend: "stable",
      description: "Data freshness and updates",
      issues: 1,
    },
    {
      name: "Validity",
      score: 89,
      trend: "up",
      description: "Schema and constraint compliance",
      issues: 4,
    },
    {
      name: "Uniqueness",
      score: 93,
      trend: "stable",
      description: "Duplicate detection",
      issues: 2,
    },
  ]

  const qualityIssues = [
    {
      dataset: "Customer Demographics",
      issue: "Missing values in age field",
      severity: "medium",
      affected: "2.3%",
      recommendation: "Implement default value strategy",
    },
    {
      dataset: "Financial Transactions",
      issue: "Inconsistent date formats",
      severity: "high",
      affected: "0.8%",
      recommendation: "Standardize date parsing",
    },
    {
      dataset: "Public Health Statistics",
      issue: "Potential duplicate records",
      severity: "low",
      affected: "1.2%",
      recommendation: "Review deduplication rules",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Overall Quality Score</p>
                <p className="text-2xl font-bold text-green-600">91.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Active Issues</p>
                <p className="text-2xl font-bold text-yellow-600">17</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Datasets Monitored</p>
                <p className="text-2xl font-bold text-blue-600">{datasets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Metrics</CardTitle>
          <CardDescription>Comprehensive quality assessment across all dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{metric.name}</h4>
                  <div className="flex items-center space-x-1">
                    <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                <Progress value={metric.score} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{metric.description}</span>
                  <Badge variant="secondary">{metric.issues} issues</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Issues & Recommendations</CardTitle>
          <CardDescription>AI-detected issues with suggested remediation actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityIssues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{issue.dataset}</h4>
                    <p className="text-sm text-gray-600 mt-1">{issue.issue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                    <span className="text-sm text-gray-500">{issue.affected} affected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-600 font-medium">{issue.recommendation}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Fix Issue</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Trends</CardTitle>
            <CardDescription>Quality score changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">This Month</p>
                  <p className="text-sm text-gray-600">Average quality improved</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">+3.2%</p>
                  <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Last Quarter</p>
                  <p className="text-sm text-gray-600">Consistency improvements</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">+1.8%</p>
                  <TrendingUp className="h-4 w-4 text-blue-600 ml-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality by Classification</CardTitle>
            <CardDescription>Quality scores by data classification level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Public</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={88} className="w-20 h-2" />
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Restricted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={92} className="w-20 h-2" />
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Confidential</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={95} className="w-20 h-2" />
                  <span className="text-sm font-medium">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Top Secret</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={98} className="w-20 h-2" />
                  <span className="text-sm font-medium">98%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
