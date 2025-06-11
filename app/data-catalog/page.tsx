"use client"

import Layout from "@/app/components/layout/Layout"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, Users, Database, Shield, GitBranch, Brain, AlertCircle } from "lucide-react"

import { DatasetCard } from "@/app/components/catalog/DatasetCard"
import { DataLineage } from "@/app/components/catalog/DataLineage"
import { AIRecommendations } from "@/app/components/catalog/AIRecommendations"
import { DataQualityDashboard } from "@/app/components/catalog/DataQualityDashboard"
import { UsageAnalytics } from "@/app/components/catalog/UsageAnalytics"
import { SmartSearch } from "@/app/components/catalog/SmartSearch"
import { DataGovernance } from "@/app/components/catalog/DataGovernance" // Import DataGovernance
import { TableDetailView } from "@/app/components/catalog/TableDetailView"
import { useData } from "@/app/contexts/DataContext" // Import useData
import type { TableMetadata } from "@/app/types" // Import TableMetadata

export default function DataCatalogPage() {
  const { processedDataSources, updateTableMetadata } = useData() // Use data from context

  // Local state for catalog page specific UI
  const [filteredDatasets, setFilteredDatasets] = useState<TableMetadata[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDatasetDetail, setSelectedDatasetDetail] = useState<TableMetadata | null>(null) // For the detail modal
  const [activeTab, setActiveTab] = useState("browse")
  const [filters, setFilters] = useState({
    classification: "All Classifications",
    owner: "All Owners", // Changed from department to owner
    sourceSystemType: "All Sources", // New filter for source type
  })
  const [sortBy, setSortBy] = useState("popularity") // Or 'lastUpdated' as a default
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true) // Manage loading state locally
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    // When data from context changes, update local state
    setFilteredDatasets(processedDataSources)
    setIsLoading(false) // Assume data is loaded once context provides it
  }, [processedDataSources])

  // Search and filter logic
  useEffect(() => {
    setIsLoading(true)
    const filtered = processedDataSources.filter((dataset) => {
      const matchesSearch =
        searchQuery === "" ||
        dataset.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dataset.tableNameAr && dataset.tableNameAr.includes(searchQuery)) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dataset.tags && dataset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        dataset.dataSourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.columns.some((column) => column.name.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesClassification =
        filters.classification === "All Classifications" ||
        dataset.overallClassificationLevel === filters.classification

      const matchesOwner = filters.owner === "All Owners" || dataset.owner === filters.owner

      const matchesSourceSystem =
        filters.sourceSystemType === "All Sources" || dataset.sourceSystemType === filters.sourceSystemType

      return matchesSearch && matchesClassification && matchesOwner && matchesSourceSystem
    })

    // Sort datasets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0)
        case "quality":
          return (b.qualityScore || 0) - (a.qualityScore || 0)
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "name":
          return a.tableName.localeCompare(b.tableName)
        default:
          return 0
      }
    })

    setFilteredDatasets(filtered)
    setIsLoading(false)
  }, [processedDataSources, searchQuery, filters, sortBy])

  const getClassificationColor = (classification?: string) => {
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

  const handleSelectDatasetForDetail = (dataset: TableMetadata) => {
    setSelectedDatasetDetail(dataset)
    setIsDetailModalOpen(true)
  }

  const handleUpdateDescriptionInCatalog = (
    tableId: string,
    columnUpdates: { columnName: string; newDescription: string }[],
    tableDescription?: string,
  ) => {
    const tableToUpdate = processedDataSources.find((d) => d.id === tableId)
    if (tableToUpdate) {
      const updatedColumns = tableToUpdate.columns.map((col) => {
        const update = columnUpdates.find((u) => u.columnName === col.name)
        return update ? { ...col, description: update.newDescription } : col
      })
      const updatedTable = {
        ...tableToUpdate,
        description: tableDescription !== undefined ? tableDescription : tableToUpdate.description,
        columns: updatedColumns,
        lastUpdated: new Date().toISOString(), // Update lastUpdated timestamp
      }
      updateTableMetadata(updatedTable) // Update in context
      // Also update the selectedDatasetDetail if it's the one being edited
      if (selectedDatasetDetail && selectedDatasetDetail.id === tableId) {
        setSelectedDatasetDetail(updatedTable)
      }
    }
  }

  // Create unique list of owners for filter dropdown
  const owners = Array.from(new Set(processedDataSources.map((ds) => ds.owner)))
  const sourceSystemTypes = Array.from(new Set(processedDataSources.map((ds) => ds.sourceSystemType)))

  if (isLoading && processedDataSources.length === 0) {
    // Show loader only if context is also empty initially
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Catalog</h1>
              <p className="text-muted-foreground mt-1">
                كتالوج البيانات - Discover, explore, and govern your data assets
              </p>
            </div>
            {/* Add Dataset button might trigger navigation to classification page or a modal */}
            {/* <Button size="sm" onClick={() => router.push('/classification')}>
              <Database className="h-4 w-4 mr-2" />
              Add/Process Dataset
            </Button> */}
          </div>

          {/* Stats Cards - these would now be derived from processedDataSources */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Datasets</p>
                    <p className="text-2xl font-bold">{processedDataSources.length}</p>
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
                    <p className="text-2xl font-bold">
                      {processedDataSources.filter((d) => d.overallClassificationLevel === "Public").length}
                    </p>
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
                      {processedDataSources.length > 0
                        ? Math.round(
                            processedDataSources.reduce((acc, d) => acc + (d.qualityScore || 0), 0) /
                              processedDataSources.length,
                          ) + "%"
                        : "N/A"}
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
                    <p className="text-sm text-gray-600">Unique Owners</p>
                    <p className="text-2xl font-bold">{owners.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
            {" "}
            {/* Adjusted grid cols */}
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center space-x-2" disabled={!selectedDatasetDetail}>
              <Brain className="h-4 w-4" />
              <span>AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="lineage" className="flex items-center space-x-2" disabled={!selectedDatasetDetail}>
              <GitBranch className="h-4 w-4" />
              <span>Lineage</span>
            </TabsTrigger>
            {/* Add other tabs if needed, ensure they use selectedDatasetDetail or processedDataSources */}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SmartSearch value={searchQuery} onChange={setSearchQuery} datasets={processedDataSources} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.classification}
                  onValueChange={(value) => setFilters({ ...filters, classification: value })}
                >
                  <SelectTrigger className="w-auto min-w-[150px]">
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

                <Select value={filters.owner} onValueChange={(value) => setFilters({ ...filters, owner: value })}>
                  <SelectTrigger className="w-auto min-w-[150px]">
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Owners">All Owners</SelectItem>
                    {owners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sourceSystemType}
                  onValueChange={(value) => setFilters({ ...filters, sourceSystemType: value })}
                >
                  <SelectTrigger className="w-auto min-w-[150px]">
                    <SelectValue placeholder="Source Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Sources">All Sources</SelectItem>
                    {sourceSystemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-auto min-w-[120px]">
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

            {filteredDatasets.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredDatasets.map((dataset) => (
                  <DatasetCard
                    key={dataset.id}
                    dataset={dataset}
                    viewMode={viewMode}
                    onSelect={handleSelectDatasetForDetail}
                    getClassificationColor={getClassificationColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Datasets Found</h3>
                <p className="text-gray-600">
                  {processedDataSources.length === 0
                    ? "No data has been processed yet. Go to the Classification page to add data."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {processedDataSources.length === 0 && (
                  <Button className="mt-4" onClick={() => (window.location.href = "/classification")}>
                    {" "}
                    {/* Simple navigation */}
                    Go to Classification Page
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Other Tabs - would need selectedDatasetDetail to be passed */}
          <TabsContent value="ai-insights">
            {selectedDatasetDetail ? (
              <AIRecommendations datasets={[selectedDatasetDetail]} />
            ) : (
              <p>Select a dataset to see AI insights.</p>
            )}
          </TabsContent>
          <TabsContent value="lineage">
            {selectedDatasetDetail ? (
              <DataLineage datasets={processedDataSources} selectedDataset={selectedDatasetDetail} />
            ) : (
              <p>Select a dataset to see its lineage.</p>
            )}
          </TabsContent>
          <TabsContent value="quality">
            <DataQualityDashboard datasets={processedDataSources} />
          </TabsContent>
          <TabsContent value="analytics">
            <UsageAnalytics datasets={processedDataSources} />
          </TabsContent>
          <TabsContent value="governance">
            <DataGovernance datasets={processedDataSources} />
          </TabsContent>
        </Tabs>

        <TableDetailView
          table={selectedDatasetDetail}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateDescription={handleUpdateDescriptionInCatalog}
        />
        {/* <CollaborationPanel dataset={selectedDatasetDetail} onClose={() => setSelectedDatasetDetail(null)} /> */}
      </div>
    </Layout>
  )
}
