"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, TrendingUp, Users, Database, Shield, GitBranch, BarChart3, Brain } from "lucide-react"
import { DatasetCard } from "@/app/components/catalog/DatasetCard"
import { DataLineage } from "@/app/components/catalog/DataLineage"
import { AIRecommendations } from "@/app/components/catalog/AIRecommendations"
import { DataQualityDashboard } from "@/app/components/catalog/DataQualityDashboard"
import { UsageAnalytics } from "@/app/components/catalog/UsageAnalytics"
import { SmartSearch } from "@/app/components/catalog/SmartSearch"
import { CollaborationPanel } from "@/app/components/catalog/CollaborationPanel"
import { DataGovernance } from "@/app/components/catalog/DataGovernance"

interface Dataset {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  classification: "عام" | "مقيد" | "سري" | "سري للغاية"
  classificationEn: "Public" | "Restricted" | "Confidential" | "Top Secret"
  owner: string
  department: string
  tags: string[]
  tagsAr: string[]
  schema: any[]
  size: string
  lastUpdated: string
  createdAt: string
  format: string[]
  source: string
  qualityScore: number
  popularity: number
  views: number
  downloads: number
  rating: number
  reviews: number
  compliance: {
    gdpr: boolean
    pdpl: boolean
    iso27001: boolean
  }
  lineage: {
    upstream: string[]
    downstream: string[]
  }
  aiInsights: {
    suggestedTags: string[]
    qualityIssues: string[]
    recommendations: string[]
    similarDatasets: string[]
  }
}

export default function DataCatalogPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [activeTab, setActiveTab] = useState("browse")
  const [filters, setFilters] = useState({
    classification: "All Classifications",
    department: "All Departments",
    format: "",
    qualityScore: "",
    tags: [],
  })
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockDatasets: Dataset[] = [
      {
        id: "1",
        name: "Customer Demographics",
        nameAr: "البيانات الديموغرافية للعملاء",
        description: "Comprehensive customer demographic data including age, location, and preferences",
        descriptionAr: "بيانات ديموغرافية شاملة للعملاء تشمل العمر والموقع والتفضيلات",
        classification: "مقيد",
        classificationEn: "Restricted",
        owner: "Ahmed Al-Rashid",
        department: "Marketing",
        tags: ["customers", "demographics", "marketing"],
        tagsAr: ["عملاء", "ديموغرافيا", "تسويق"],
        schema: [
          { name: "customer_id", type: "string", classification: "مقيد" },
          { name: "age", type: "integer", classification: "عام" },
          { name: "location", type: "string", classification: "عام" },
        ],
        size: "2.5 GB",
        lastUpdated: "2024-01-15",
        createdAt: "2023-06-01",
        format: ["CSV", "Parquet"],
        source: "CRM System",
        qualityScore: 92,
        popularity: 85,
        views: 1250,
        downloads: 89,
        rating: 4.5,
        reviews: 23,
        compliance: {
          gdpr: true,
          pdpl: true,
          iso27001: false,
        },
        lineage: {
          upstream: ["CRM Database", "Survey System"],
          downstream: ["Analytics Dashboard", "ML Models"],
        },
        aiInsights: {
          suggestedTags: ["segmentation", "analytics", "business-intelligence"],
          qualityIssues: ["Missing values in 2% of records", "Potential duplicates detected"],
          recommendations: ["Consider data enrichment", "Implement data validation rules"],
          similarDatasets: ["Sales Data", "Product Analytics"],
        },
      },
      {
        id: "2",
        name: "Financial Transactions",
        nameAr: "المعاملات المالية",
        description: "Daily financial transaction records with enhanced security",
        descriptionAr: "سجلات المعاملات المالية اليومية مع أمان معزز",
        classification: "سري",
        classificationEn: "Confidential",
        owner: "Sara Al-Mahmoud",
        department: "Finance",
        tags: ["finance", "transactions", "security"],
        tagsAr: ["مالية", "معاملات", "أمان"],
        schema: [
          { name: "transaction_id", type: "string", classification: "سري" },
          { name: "amount", type: "decimal", classification: "سري" },
          { name: "date", type: "date", classification: "عام" },
        ],
        size: "15.2 GB",
        lastUpdated: "2024-01-16",
        createdAt: "2023-01-01",
        format: ["JSON", "CSV"],
        source: "Payment Gateway",
        qualityScore: 98,
        popularity: 72,
        views: 890,
        downloads: 45,
        rating: 4.8,
        reviews: 15,
        compliance: {
          gdpr: true,
          pdpl: true,
          iso27001: true,
        },
        lineage: {
          upstream: ["Payment System", "Bank API"],
          downstream: ["Risk Analysis", "Compliance Reports"],
        },
        aiInsights: {
          suggestedTags: ["payments", "risk-management", "compliance"],
          qualityIssues: ["Excellent data quality"],
          recommendations: ["Archive old transactions", "Implement real-time monitoring"],
          similarDatasets: ["Account Balances", "Credit Scores"],
        },
      },
      {
        id: "3",
        name: "Public Health Statistics",
        nameAr: "إحصائيات الصحة العامة",
        description: "Anonymized public health data for research and policy making",
        descriptionAr: "بيانات الصحة العامة المجهولة للبحث ووضع السياسات",
        classification: "عام",
        classificationEn: "Public",
        owner: "Dr. Mohammed Al-Zahrani",
        department: "Health",
        tags: ["health", "public", "research", "statistics"],
        tagsAr: ["صحة", "عام", "بحث", "إحصائيات"],
        schema: [
          { name: "region", type: "string", classification: "عام" },
          { name: "disease_count", type: "integer", classification: "عام" },
          { name: "population", type: "integer", classification: "عام" },
        ],
        size: "850 MB",
        lastUpdated: "2024-01-14",
        createdAt: "2023-03-15",
        format: ["CSV", "Excel", "JSON"],
        source: "Ministry of Health",
        qualityScore: 88,
        popularity: 95,
        views: 2100,
        downloads: 156,
        rating: 4.3,
        reviews: 42,
        compliance: {
          gdpr: true,
          pdpl: true,
          iso27001: false,
        },
        lineage: {
          upstream: ["Hospital Systems", "Clinic Records"],
          downstream: ["Research Papers", "Policy Reports", "Public Dashboards"],
        },
        aiInsights: {
          suggestedTags: ["epidemiology", "public-policy", "healthcare-analytics"],
          qualityIssues: ["Some regional data gaps", "Seasonal reporting variations"],
          recommendations: ["Standardize reporting periods", "Add demographic breakdowns"],
          similarDatasets: ["Education Statistics", "Economic Indicators"],
        },
      },
    ]

    setDatasets(mockDatasets)
    setFilteredDatasets(mockDatasets)
    setIsLoading(false)
  }, [])

  // Search and filter logic
  useEffect(() => {
    const filtered = datasets.filter((dataset) => {
      const matchesSearch =
        searchQuery === "" ||
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.nameAr.includes(searchQuery) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesClassification =
        filters.classification === "All Classifications" || dataset.classificationEn === filters.classification

      const matchesDepartment = filters.department === "All Departments" || dataset.department === filters.department

      const matchesFormat = filters.format === "" || dataset.format.includes(filters.format)

      return matchesSearch && matchesClassification && matchesDepartment && matchesFormat
    })

    // Sort datasets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity
        case "quality":
          return b.qualityScore - a.qualityScore
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredDatasets(filtered)
  }, [datasets, searchQuery, filters, sortBy])

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Public":
        return "bg-green-100 text-green-800"
      case "Restricted":
        return "bg-yellow-100 text-yellow-800"
      case "Confidential":
        return "bg-orange-100 text-orange-800"
      case "Top Secret":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Catalog</h1>
            <p className="text-gray-600 mt-1">كتالوج البيانات - Discover, explore, and govern your data assets</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Catalog
            </Button>
            <Button size="sm">
              <Database className="h-4 w-4 mr-2" />
              Add Dataset
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Datasets</p>
                  <p className="text-2xl font-bold">{datasets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Public Datasets</p>
                  <p className="text-2xl font-bold">{datasets.filter((d) => d.classificationEn === "Public").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Quality Score</p>
                  <p className="text-2xl font-bold">
                    {Math.round(datasets.reduce((acc, d) => acc + d.qualityScore, 0) / datasets.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="browse" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Browse</span>
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="lineage" className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>Lineage</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Quality</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Governance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SmartSearch value={searchQuery} onChange={setSearchQuery} datasets={datasets} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.classification}
                onValueChange={(value) => setFilters({ ...filters, classification: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Classifications">All Classifications</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Restricted">Restricted</SelectItem>
                  <SelectItem value="Confidential">Confidential</SelectItem>
                  <SelectItem value="Top Secret">Top Secret</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.department}
                onValueChange={(value) => setFilters({ ...filters, department: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>

          {/* Dataset Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredDatasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                viewMode={viewMode}
                onSelect={setSelectedDataset}
                getClassificationColor={getClassificationColor}
              />
            ))}
          </div>

          {filteredDatasets.length === 0 && (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-insights">
          <AIRecommendations datasets={datasets} />
        </TabsContent>

        <TabsContent value="lineage">
          <DataLineage datasets={datasets} selectedDataset={selectedDataset} />
        </TabsContent>

        <TabsContent value="quality">
          <DataQualityDashboard datasets={datasets} />
        </TabsContent>

        <TabsContent value="analytics">
          <UsageAnalytics datasets={datasets} />
        </TabsContent>

        <TabsContent value="governance">
          <DataGovernance datasets={datasets} />
        </TabsContent>
      </Tabs>

      {/* Collaboration Panel */}
      {selectedDataset && <CollaborationPanel dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />}
    </div>
  )
}
