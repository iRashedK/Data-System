"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Database, ArrowRight, Layers, Network } from "lucide-react"

interface DataLineageProps {
  datasets: any[]
  selectedDataset: any
}

export function DataLineage({ datasets, selectedDataset }: DataLineageProps) {
  const lineageData = {
    upstream: [
      { name: "CRM Database", type: "source", status: "active" },
      { name: "Survey System", type: "source", status: "active" },
      { name: "External API", type: "source", status: "inactive" },
    ],
    current: selectedDataset || datasets[0],
    downstream: [
      { name: "Analytics Dashboard", type: "consumer", status: "active" },
      { name: "ML Models", type: "consumer", status: "active" },
      { name: "Reporting System", type: "consumer", status: "pending" },
    ],
  }

  const transformations = [
    { step: 1, name: "Data Extraction", description: "Extract from source systems" },
    { step: 2, name: "Data Cleaning", description: "Remove duplicates and validate" },
    { step: 3, name: "Data Transformation", description: "Apply business rules" },
    { step: 4, name: "Data Classification", description: "Apply Saudi regulations" },
    { step: 5, name: "Data Storage", description: "Store in data warehouse" },
  ]

  return (
    <div className="space-y-6">
      {/* Lineage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            <span>Data Lineage Overview</span>
          </CardTitle>
          <CardDescription>Trace data flow from sources to consumers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8 p-6">
            {/* Upstream Sources */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-center text-gray-700">Sources</h3>
              {lineageData.upstream.map((source, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${source.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                  ></div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 min-w-32">
                    <Database className="h-4 w-4 text-blue-600 mb-1" />
                    <p className="text-sm font-medium">{source.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {source.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <ArrowRight className="h-6 w-6 text-gray-400" />

            {/* Current Dataset */}
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Current Dataset</h3>
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 min-w-48">
                <Layers className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold">{lineageData.current.name}</p>
                <p className="text-sm text-gray-600">{lineageData.current.nameAr}</p>
                <Badge className="mt-2">{lineageData.current.classificationEn}</Badge>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-6 w-6 text-gray-400" />

            {/* Downstream Consumers */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-center text-gray-700">Consumers</h3>
              {lineageData.downstream.map((consumer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 min-w-32">
                    <Network className="h-4 w-4 text-green-600 mb-1" />
                    <p className="text-sm font-medium">{consumer.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {consumer.type}
                    </Badge>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${consumer.status === "active" ? "bg-green-500" : consumer.status === "pending" ? "bg-yellow-500" : "bg-gray-400"}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Data Transformation Pipeline</CardTitle>
          <CardDescription>Step-by-step data processing and classification workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformations.map((transform, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{transform.step}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{transform.name}</h4>
                  <p className="text-sm text-gray-600">{transform.description}</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upstream Impact</CardTitle>
            <CardDescription>How changes in source systems affect this dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">CRM Database Schema Change</p>
                  <p className="text-sm text-gray-600">New customer fields added</p>
                </div>
                <Badge variant="secondary">Medium Impact</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Survey System Update</p>
                  <p className="text-sm text-gray-600">Data quality improved</p>
                </div>
                <Badge variant="secondary">Low Impact</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Downstream Impact</CardTitle>
            <CardDescription>How changes to this dataset affect consumers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Analytics Dashboard</p>
                  <p className="text-sm text-gray-600">Requires schema update</p>
                </div>
                <Badge variant="destructive">High Impact</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">ML Models</p>
                  <p className="text-sm text-gray-600">May need retraining</p>
                </div>
                <Badge variant="secondary">Medium Impact</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
