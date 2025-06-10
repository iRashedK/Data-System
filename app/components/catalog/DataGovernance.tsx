"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, Clock, Users, FileText, Lock, Eye } from "lucide-react"

interface DataGovernanceProps {
  datasets: any[]
}

export function DataGovernance({ datasets }: DataGovernanceProps) {
  const complianceMetrics = [
    {
      name: "GDPR Compliance",
      score: 94,
      total: datasets.length,
      compliant: Math.floor(datasets.length * 0.94),
      icon: Shield,
      color: "text-green-600",
    },
    {
      name: "PDPL Compliance",
      score: 89,
      total: datasets.length,
      compliant: Math.floor(datasets.length * 0.89),
      icon: Lock,
      color: "text-blue-600",
    },
    {
      name: "ISO 27001",
      score: 76,
      total: datasets.length,
      compliant: Math.floor(datasets.length * 0.76),
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ]

  const governanceIssues = [
    {
      type: "Access Control",
      severity: "high",
      count: 3,
      description: "Datasets with overly broad access permissions",
      action: "Review and restrict access",
    },
    {
      type: "Data Retention",
      severity: "medium",
      count: 7,
      description: "Datasets without defined retention policies",
      action: "Define retention schedules",
    },
    {
      type: "Classification",
      severity: "low",
      count: 2,
      description: "Datasets pending classification review",
      action: "Complete classification",
    },
  ]

  const accessRequests = [
    {
      user: "Ahmed Al-Rashid",
      dataset: "Financial Transactions",
      requestType: "Read Access",
      status: "pending",
      requestDate: "2024-01-15",
      justification: "Required for quarterly financial analysis",
    },
    {
      user: "Sara Al-Mahmoud",
      dataset: "Customer Demographics",
      requestType: "Export Permission",
      status: "approved",
      requestDate: "2024-01-14",
      justification: "Marketing campaign segmentation",
    },
    {
      user: "Dr. Mohammed Al-Zahrani",
      dataset: "Public Health Statistics",
      requestType: "Modification Rights",
      status: "rejected",
      requestDate: "2024-01-13",
      justification: "Data quality improvements",
    },
  ]

  const dataLineage = [
    {
      dataset: "Customer Demographics",
      sources: ["CRM System", "Survey Platform"],
      consumers: ["Analytics Dashboard", "ML Pipeline"],
      lastAudit: "2024-01-10",
      status: "compliant",
    },
    {
      dataset: "Financial Transactions",
      sources: ["Payment Gateway", "Bank API"],
      consumers: ["Risk Engine", "Compliance Reports"],
      lastAudit: "2024-01-08",
      status: "review_needed",
    },
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {complianceMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${metric.color}`} />
                    <span className="font-semibold text-sm">{metric.name}</span>
                  </div>
                  <span className={`text-lg font-bold ${metric.color}`}>{metric.score}%</span>
                </div>
                <Progress value={metric.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">
                  {metric.compliant} of {metric.total} datasets compliant
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Governance Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Governance Issues</span>
          </CardTitle>
          <CardDescription>Issues requiring attention to maintain compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {governanceIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold">{issue.type}</h4>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{issue.count} datasets affected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {issue.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Access Requests</span>
          </CardTitle>
          <CardDescription>Pending and recent data access requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessRequests.map((request, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{request.user}</h4>
                    <p className="text-sm text-gray-600">
                      {request.dataset} - {request.requestType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Requested on {request.requestDate}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{request.justification}</p>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost">
                      Review
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Lineage & Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Audit Trail</span>
            </CardTitle>
            <CardDescription>Data lineage and audit information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataLineage.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.dataset}</h4>
                    <Badge variant={item.status === "compliant" ? "default" : "secondary"}>
                      {item.status === "compliant" ? "Compliant" : "Review Needed"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Sources:</strong> {item.sources.join(", ")}
                    </p>
                    <p>
                      <strong>Consumers:</strong> {item.consumers.join(", ")}
                    </p>
                    <p>
                      <strong>Last Audit:</strong> {item.lastAudit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <span>Data Privacy</span>
            </CardTitle>
            <CardDescription>Privacy and protection measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Encryption at Rest</p>
                  <p className="text-sm text-gray-600">All sensitive data encrypted</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Access Logging</p>
                  <p className="text-sm text-gray-600">All access events tracked</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Data Anonymization</p>
                  <p className="text-sm text-gray-600">Partial implementation</p>
                </div>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Retention Policies</p>
                  <p className="text-sm text-gray-600">Automated cleanup enabled</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
