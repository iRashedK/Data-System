"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Download, Eye, Star } from "lucide-react"

interface UsageAnalyticsProps {
  datasets: any[]
}

export function UsageAnalytics({ datasets }: UsageAnalyticsProps) {
  const usageData = [
    { month: "Jan", views: 1200, downloads: 89, users: 45 },
    { month: "Feb", views: 1350, downloads: 102, users: 52 },
    { month: "Mar", views: 1180, downloads: 95, users: 48 },
    { month: "Apr", views: 1420, downloads: 118, users: 58 },
    { month: "May", views: 1580, downloads: 134, users: 65 },
    { month: "Jun", views: 1650, downloads: 142, users: 71 },
  ]

  const popularDatasets = [
    { name: "Public Health Statistics", views: 2100, downloads: 156, rating: 4.3 },
    { name: "Customer Demographics", views: 1250, downloads: 89, rating: 4.5 },
    { name: "Financial Transactions", views: 890, downloads: 45, rating: 4.8 },
    { name: "Education Statistics", views: 750, downloads: 67, rating: 4.1 },
    { name: "Economic Indicators", views: 680, downloads: 52, rating: 4.2 },
  ]

  const departmentUsage = [
    { name: "Health", value: 35, color: "#10B981" },
    { name: "Finance", value: 25, color: "#3B82F6" },
    { name: "Education", value: 20, color: "#8B5CF6" },
    { name: "Marketing", value: 15, color: "#F59E0B" },
    { name: "Others", value: 5, color: "#6B7280" },
  ]

  const userActivity = [
    { user: "Ahmed Al-Rashid", department: "Marketing", datasets: 12, lastActive: "2 hours ago" },
    { user: "Sara Al-Mahmoud", department: "Finance", datasets: 8, lastActive: "1 day ago" },
    { user: "Dr. Mohammed Al-Zahrani", department: "Health", datasets: 15, lastActive: "3 hours ago" },
    { user: "Fatima Al-Qasimi", department: "Education", datasets: 6, lastActive: "5 hours ago" },
    { user: "Omar Al-Saud", department: "IT", datasets: 9, lastActive: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">9,380</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold">685</p>
                <p className="text-xs text-green-600">+8% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">247</p>
                <p className="text-xs text-green-600">+15% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">4.4</p>
                <p className="text-xs text-green-600">+0.2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>Views and downloads over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
            <CardDescription>Data consumption by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Datasets */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Datasets</CardTitle>
          <CardDescription>Top performing datasets by views and downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularDatasets.map((dataset, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{dataset.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {dataset.views} views
                      </span>
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {dataset.downloads} downloads
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {dataset.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>Most active users and their dataset interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userActivity.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{user.user}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{user.department}</span>
                      <span>{user.datasets} datasets accessed</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{user.lastActive}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
