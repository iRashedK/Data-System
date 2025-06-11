"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/Layout" // Assuming this path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/classification/FileUploader" // Assuming this path
import { DatabaseConnector } from "@/components/classification/DatabaseConnector" // Assuming this path
import { FileSpreadsheet, Database, Download, Filter, Search, AlertCircle } from "lucide-react"
import { useData } from "@/app/contexts/DataContext"
import type { TableMetadata, ColumnMetadata } from "@/app/types" // Assuming this path
import { classifyDataAccordingToSaudiPolicy } from "@/app/utils/saudi-classification" // Assuming this path
// import { classifyWithAI } from "@/app/utils/ai-classification"; // Would be used for real AI

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

export default function ClassificationPage() {
  const { addProcessedDataSource, processedDataSources } = useData()
  const [activeTab, setActiveTab] = useState("upload")
  const [currentProcessingTable, setCurrentProcessingTable] = useState<TableMetadata | null>(null)

  // Filters for the displayed table
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClassification, setFilterClassification] = useState("all")

  // This will be the table currently selected for display from processedDataSources
  const [selectedDisplayTableId, setSelectedDisplayTableId] = useState<string | null>(null)

  const displayTable = processedDataSources.find((table) => table.id === selectedDisplayTableId)

  const handleFileUpload = async (file: File) => {
    // Simulate file parsing and initial metadata extraction
    // In a real app, this would involve reading the Excel file (e.g., using a library like 'xlsx')
    console.log("Simulating processing for file:", file.name)

    // Mock data extraction - assuming one sheet for simplicity
    const sheetName = "Sheet1" // Or get actual sheet names
    const newTableId = generateId()

    // Mock columns from the file
    const mockColumnsFromFile = [
      { name: "national_id", sampleData: ["1234567890", "1987654321"] },
      { name: "email_address", sampleData: ["test@example.com", "user@domain.sa"] },
      { name: "full_name", sampleData: ["John Doe", "Jane Smith"] },
      { name: "department", sampleData: ["HR", "Finance"] },
    ]

    const columns: ColumnMetadata[] = mockColumnsFromFile.map((colFromFile) => {
      // Perform classification (using Saudi policy for this example)
      // In a real scenario, you might call classifyWithAI or a similar function
      const classificationResult = classifyDataAccordingToSaudiPolicy(colFromFile.name, colFromFile.sampleData)

      return {
        name: colFromFile.name,
        dataType: "VARCHAR", // Infer or set default
        isPK: false, // Infer or set default
        isFK: false, // Infer or set default
        description: classificationResult.description || `Description for ${colFromFile.name}`, // AI generated or default

        // Classification details
        classificationLevel: classificationResult.classificationEn,
        classificationLevelAr: classificationResult.classification,
        classificationJustification: classificationResult.justification,
        // classificationRegulation: "PDPL", // Example, or from result
        impactLevel: classificationResult.impactLevel,
        impactCategory: classificationResult.impactCategory,
        confidence: 0.9, // Example
        sampleValues: colFromFile.sampleData.slice(0, 3),
      }
    })

    let sensitiveColumnCount = 0
    columns.forEach((col) => {
      if (col.classificationLevel === "Top Secret" || col.classificationLevel === "Confidential") {
        sensitiveColumnCount++
      }
    })

    const newTable: TableMetadata = {
      id: newTableId,
      dataSourceName: file.name,
      sourceSystemType: "Excel",
      tableName: sheetName,
      tableNameAr: `ورقة 1 (${file.name})`, // Example Arabic name
      columns,
      owner: "Current User", // Replace with actual user
      description: `Data extracted from ${file.name}, sheet ${sheetName}.`, // AI generated or default
      descriptionAr: `بيانات مستخرجة من ${file.name}، ورقة ${sheetName}.`,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      columnCount: columns.length,
      sensitiveColumnCount: sensitiveColumnCount, // Calculate this
      // Populate other TableMetadata fields as needed (overallClassification, riskLevel, etc.)
      // For example, derive overallClassificationLevel:
      overallClassificationLevel: columns.some((c) => c.classificationLevel === "Top Secret")
        ? "Top Secret"
        : columns.some((c) => c.classificationLevel === "Confidential")
          ? "Confidential"
          : columns.some((c) => c.classificationLevel === "Restricted")
            ? "Restricted"
            : "Public",
      tags: ["excel-upload", file.name.split(".")[0]],
      size: `${(file.size / 1024).toFixed(2)} KB`,
    }

    setCurrentProcessingTable(newTable) // Show processing state if needed
    addProcessedDataSource(newTable)
    setSelectedDisplayTableId(newTableId) // Automatically select the newly processed table for display
    setCurrentProcessingTable(null) // Clear processing state
    console.log("File processed and added to context:", newTable)
  }

  const getBadgeColor = (classification?: string) => {
    switch (classification) {
      case "Top Secret":
        return "destructive"
      case "Confidential":
        return "warning" // Using 'warning' for orange-like
      case "Restricted":
        return "secondary" // Using 'secondary' for yellow/neutral
      case "Public":
        return "default" // Using 'default' for green/blue like
      default:
        return "outline"
    }
  }

  const filteredColumns =
    displayTable?.columns.filter((col) => {
      const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterClassification === "all" || col.classificationLevel === filterClassification
      return matchesSearch && matchesFilter
    }) || []

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Classification</h1>
            <p className="text-muted-foreground">Upload files or connect to databases for AI-powered classification</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Database Connection</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            {/* Pass the handleFileUpload to FileUploader */}
            <FileUploader onFileUpload={handleFileUpload} />
          </TabsContent>

          <TabsContent value="database" className="mt-4">
            <DatabaseConnector /> {/* DB Connector would also call addProcessedDataSource */}
          </TabsContent>
        </Tabs>

        {/* Display selection for processed tables if multiple exist */}
        {processedDataSources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Processed Data Source to View</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedDisplayTableId} value={selectedDisplayTableId || ""}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a data source" />
                </SelectTrigger>
                <SelectContent>
                  {processedDataSources.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.dataSourceName} - {ds.tableName} ({new Date(ds.createdAt).toLocaleTimeString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Classification Results Table - now uses displayTable from context */}
        {displayTable ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  Classification Results for: {displayTable.dataSourceName} - {displayTable.tableName}
                </CardTitle>
                <CardDescription>
                  Review and manage classified data columns. Overall:
                  <Badge variant={getBadgeColor(displayTable.overallClassificationLevel)} className="ml-2">
                    {displayTable.overallClassificationLevel || "N/A"}
                  </Badge>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search columns..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterClassification} onValueChange={setFilterClassification}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classifications</SelectItem>
                      <SelectItem value="Top Secret">Top Secret</SelectItem>
                      <SelectItem value="Confidential">Confidential</SelectItem>
                      <SelectItem value="Restricted">Restricted</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Regulation</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Description</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColumns.map((col) => (
                      <TableRow key={col.name}>
                        <TableCell className="font-medium">{col.name}</TableCell>
                        <TableCell>{col.dataType}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeColor(col.classificationLevel)}>
                            {col.classificationLevel || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{col.classificationRegulation || "N/A"}</TableCell>
                        <TableCell>{col.confidence ? (col.confidence * 100).toFixed(0) + "%" : "N/A"}</TableCell>
                        <TableCell className="truncate max-w-xs" title={col.description}>
                          {col.description}
                        </TableCell>
                        {/* Actions like Edit/View Details can be added here */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredColumns.length === 0 && searchTerm && (
                <p className="text-center text-muted-foreground mt-4">No columns match your search.</p>
              )}
            </CardContent>
          </Card>
        ) : processedDataSources.length > 0 ? (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Please select a processed data source to view its classification results.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No data processed yet.</p>
              <p className="text-muted-foreground">Upload a file or connect to a database to begin classification.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
