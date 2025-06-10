"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, TrendingUp, Users, Zap, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface AIRecommendationsProps {
  datasets: any[]
}

export function AIRecommendations({ datasets }: AIRecommendationsProps) {
  const recommendations = [
    {
      type: "quality",
      title: "Data Quality Improvement",
      description: "Customer Demographics dataset has 2% missing values",
      action: "Implement data validation rules",
      priority: "high",
      impact: "Improve data reliability by 15%",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      type: "usage",
      title: "Underutilized Dataset",
      description: "Public Health Statistics has high quality but low usage",
      action: "Promote to research teams",
      priority: "medium",
      impact: "Increase research productivity",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      type: "compliance",
      title: "Compliance Enhancement",
      description: "Financial Transactions needs ISO27001 certification",
      action: "Schedule compliance audit",
      priority: "high",
      impact: "Meet regulatory requirements",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      type: "optimization",
      title: "Storage Optimization",
      description: "Archive old transaction data to reduce costs",
      action: "Implement data lifecycle policy",
      priority: "low",
      impact: "Reduce storage costs by 30%",
      icon: Zap,
      color: "text-purple-600",
    },
  ]

  const insights = [
    {
      title: "Data Usage Patterns",
      description: "Public datasets are accessed 3x more than restricted ones",
      metric: "300% increase",
      trend: "up",
    },
    {
      title: "Quality Trends",
      description: "Average data quality improved by 12% this quarter",
      metric: "+12%",
      trend: "up",
    },
    {
      title: "Popular Categories",
      description: "Health and Finance datasets are most requested",
      metric: "65% of requests",
      trend: "stable",
    },
  ]

  const suggestedDatasets = [
    {
      name: "Economic Indicators",
      reason: "Complements your Public Health Statistics",
      confidence: 92,
    },
    {
      name: "Education Statistics",
      reason: "Similar structure to Health data",
      confidence: 87,
    },
    {
      name: "Population Census",
      reason: "Enhances demographic analysis",
      confidence: 84,
    },
  ]

  return (
    <div className="space-y-6">
      {/* AI Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{insight.metric}</p>
                  <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Recommendations</span>
            </CardTitle>
            <CardDescription>Intelligent suggestions to improve your data catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`h-5 w-5 ${rec.color}`} />
                      <h4 className="font-semibold">{rec.title}</h4>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-600 font-medium">{rec.impact}</p>
                    <Button size="sm" variant="outline">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Suggested Datasets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <span>Suggested Datasets</span>
            </CardTitle>
            <CardDescription>Datasets that might interest you based on your activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedDatasets.map((dataset, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{dataset.name}</h4>
                  <Badge variant="secondary">{dataset.confidence}% match</Badge>
                </div>
                <p className="text-sm text-gray-600">{dataset.reason}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Dataset
                  </Button>
                  <Button size="sm" variant="ghost">
                    Not Interested
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Smart Analytics</span>
          </CardTitle>
          <CardDescription>AI-generated insights about your data catalog usage and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">247</p>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-xs text-green-600">+15% this month</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Avg Quality Score</p>
              <p className="text-xs text-green-600">+5% improvement</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-gray-600">AI Suggestions</p>
              <p className="text-xs text-green-600">92% accuracy</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">23</p>
              <p className="text-sm text-gray-600">Auto-tagged</p>
              <p className="text-xs text-green-600">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
