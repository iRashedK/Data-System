"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Globe,
  FileText,
  Download,
  FileSpreadsheet,
  Code,
  Tag,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types for classified data
interface ClassifiedField {
  id: number
  column: string
  description: string
  dataType: string
  sampleValues: any[]
  classification: "Public" | "Restricted" | "Confidential" | "Top Secret"
  justification: string
  sourceTable: string
  selected: boolean
}

// Types for dataset
interface Dataset {
  id: string
  name: string
  description: string
  fields: ClassifiedField[]
  createdAt: string
  lastUpdated: string
}

export default function OpenDataPage() {
  // State for available classified data
  const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [publicFields, setPublicFields] = useState<ClassifiedField[]>([])
  const [selectedFields, setSelectedFields] = useState<ClassifiedField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for dataset metadata
  const [datasetTitle, setDatasetTitle] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const [suggestedUses, setSuggestedUses] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [exportFormat, setExportFormat] = useState("csv")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Fetch classified data on component mount
  useEffect(() => {
    fetchClassifiedData()
  }, [])

  // Effect to update fields when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      // Filter only public fields from the selected dataset
      const publicOnlyFields = selectedDataset.fields.filter((field) => field.classification === "Public")
      setPublicFields(publicOnlyFields)
      setSelectedFields(publicOnlyFields.filter((field) => field.selected))

      // Update metadata
      setDatasetTitle(`${selectedDataset.name} - Public Data`)
      setDatasetDescription(
        `This dataset contains public information extracted from ${selectedDataset.name}, including only fields classified as Public according to data governance policies.`,
      )

      // Generate default tags
      setTags(["public-data", ...selectedDataset.name.toLowerCase().split(" ")])
    }
  }, [selectedDataset])

  // Fetch classified data from the API
  const fetchClassifiedData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate with mock data
      setTimeout(() => {
        const mockDatasets: Dataset[] = [
          {
            id: "ds-001",
            name: "Public Services Database",
            description: "Database of public services across Saudi Arabia",
            createdAt: "2025-05-15T10:30:00Z",
            lastUpdated: "2025-06-08T14:22:00Z",
            fields: [
              {
                id: 1,
                column: "service_name",
                description: "Name of the public service",
                dataType: "string",
                sampleValues: ["Health Services", "Education", "Transportation", "Public Safety"],
                classification: "Public",
                justification: "Service names are publicly available information",
                sourceTable: "services",
                selected: true,
              },
              {
                id: 2,
                column: "city",
                description: "City where the service is provided",
                dataType: "string",
                sampleValues: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
                classification: "Public",
                justification: "Geographic locations are public information",
                sourceTable: "services",
                selected: true,
              },
              {
                id: 3,
                column: "sector",
                description: "Sector classification",
                dataType: "string",
                sampleValues: ["Healthcare", "Education", "Transportation", "Security"],
                classification: "Public",
                justification: "Sector classifications are public information",
                sourceTable: "services",
                selected: true,
              },
              {
                id: 4,
                column: "beneficiaries_count",
                description: "Number of people benefiting from the service",
                dataType: "number",
                sampleValues: [1250, 3400, 5600, 2800],
                classification: "Public",
                justification: "Aggregate statistics without personal identifiers",
                sourceTable: "services",
                selected: true,
              },
              {
                id: 5,
                column: "region",
                description: "Administrative region",
                dataType: "string",
                sampleValues: ["Central", "Western", "Eastern", "Northern", "Southern"],
                classification: "Public",
                justification: "Geographic regions are public information",
                sourceTable: "services",
                selected: false,
              },
              {
                id: 6,
                column: "year",
                description: "Year of data collection",
                dataType: "number",
                sampleValues: [2021, 2022, 2023],
                classification: "Public",
                justification: "Temporal information is public",
                sourceTable: "services",
                selected: false,
              },
              {
                id: 7,
                column: "service_manager",
                description: "Manager of the service",
                dataType: "string",
                sampleValues: ["Ahmed Al-Saud", "Fatima Al-Qahtani", "Mohammed Al-Harbi"],
                classification: "Restricted",
                justification: "Contains personal names that require consent for disclosure",
                sourceTable: "services",
                selected: false,
              },
              {
                id: 8,
                column: "budget_allocation",
                description: "Budget allocated to the service",
                dataType: "number",
                sampleValues: [1500000, 2300000, 3400000],
                classification: "Confidential",
                justification: "Financial data with security implications",
                sourceTable: "services",
                selected: false,
              },
            ],
          },
          {
            id: "ds-002",
            name: "National Infrastructure Projects",
            description: "Infrastructure development projects across the country",
            createdAt: "2025-04-22T09:15:00Z",
            lastUpdated: "2025-06-05T11:45:00Z",
            fields: [
              {
                id: 9,
                column: "project_name",
                description: "Name of the infrastructure project",
                dataType: "string",
                sampleValues: ["Metro Line Extension", "Solar Power Plant", "Highway Development"],
                classification: "Public",
                justification: "Project names are publicly announced",
                sourceTable: "projects",
                selected: true,
              },
              {
                id: 10,
                column: "location",
                description: "Project location",
                dataType: "string",
                sampleValues: ["Riyadh North", "Jeddah Coast", "Eastern Province"],
                classification: "Public",
                justification: "Project locations are publicly available",
                sourceTable: "projects",
                selected: true,
              },
              {
                id: 11,
                column: "completion_percentage",
                description: "Percentage of project completion",
                dataType: "number",
                sampleValues: [25, 50, 75, 100],
                classification: "Public",
                justification: "Progress information is shared publicly",
                sourceTable: "projects",
                selected: true,
              },
              {
                id: 12,
                column: "contractor",
                description: "Main contractor for the project",
                dataType: "string",
                sampleValues: ["Al-Rajhi Construction", "Saudi Binladin Group", "AECOM"],
                classification: "Public",
                justification: "Contractor information is publicly disclosed",
                sourceTable: "projects",
                selected: false,
              },
              {
                id: 13,
                column: "security_clearance",
                description: "Security clearance level required",
                dataType: "string",
                sampleValues: ["Level 1", "Level 2", "Level 3"],
                classification: "Top Secret",
                justification: "Security protocols are highly sensitive",
                sourceTable: "projects",
                selected: false,
              },
            ],
          },
        ]

        setAvailableDatasets(mockDatasets)
        setSelectedDataset(mockDatasets[0])
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setError("Failed to fetch classified data. Please try again.")
      setIsLoading(false)
    }
  }

  // Simulate AI generation of metadata and insights
  const generateMetadata = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)

          // Update with AI-generated content
          setDatasetTitle(`${selectedDataset?.name} Public Dataset`)
          setDatasetDescription(
            `This curated public dataset provides comprehensive information on ${selectedDataset?.name.toLowerCase()}, including geographic distribution, service categories, and beneficiary statistics. The data has been classified according to Saudi data governance standards, ensuring only public information is included.`,
          )

          setSuggestedUses([
            "Create interactive dashboards showing service distribution by city and region",
            "Generate policy reports on service coverage across different sectors",
            "Develop applications to help citizens locate nearby public services",
            "Conduct research on service utilization patterns across different regions",
            "Analyze trends in public service delivery over time",
            "Compare service distribution with demographic data for planning purposes",
          ])

          setTags([
            "public-services",
            "saudi-arabia",
            "open-data",
            "cities",
            "sectors",
            "service-delivery",
            "geographic-data",
          ])

          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  // Handle field selection
  const toggleFieldSelection = (fieldId: number) => {
    const field = publicFields.find((f) => f.id === fieldId)
    if (!field) return

    if (selectedFields.some((f) => f.id === fieldId)) {
      setSelectedFields(selectedFields.filter((f) => f.id !== fieldId))
    } else {
      setSelectedFields([...selectedFields, field])
    }
  }

  // Handle tag addition
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  // Handle tag removal
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Export dataset
  const exportDataset = () => {
    if (selectedFields.length === 0) {
      setError("Please select at least one field to export")
      return
    }

    alert(`Exporting dataset as ${exportFormat.toUpperCase()} with ${selectedFields.length} fields`)
    // In a real app, this would trigger the actual export
  }

  // Handle dataset selection change
  const handleDatasetChange = (datasetId: string) => {
    const dataset = availableDatasets.find((ds) => ds.id === datasetId)
    if (dataset) {
      setSelectedDataset(dataset)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Open Data Generator</h1>
            <p className="text-muted-foreground">Create and publish open datasets from your classified data</p>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border-green-200"
          >
            <Globe className="h-4 w-4" />
            <span>Public Data Only</span>
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading classified data...</p>
          </div>
        ) : (
          <>
            {/* Dataset Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Classified Dataset</CardTitle>
                <CardDescription>Choose a dataset that has been classified to extract public data</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDataset?.id} onValueChange={handleDatasetChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a classified dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDatasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedDataset && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last updated:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(selectedDataset.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total fields:</span>
                      <span className="text-sm text-muted-foreground">{selectedDataset.fields.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Public fields:</span>
                      <span className="text-sm text-green-600 font-medium">
                        {selectedDataset.fields.filter((f) => f.classification === "Public").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Non-public fields:</span>
                      <span className="text-sm text-red-600 font-medium">
                        {selectedDataset.fields.filter((f) => f.classification !== "Public").length}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Dataset Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Metadata</CardTitle>
                  <CardDescription>Define the metadata for your open dataset</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Dataset Title</Label>
                    <Input id="title" value={datasetTitle} onChange={(e) => setDatasetTitle(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Dataset Description</Label>
                    <Textarea
                      id="description"
                      rows={5}
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <span className="ml-1">×</span>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button variant="outline" size="icon" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>AI-Generated Suggestions</Label>
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={generateMetadata}
                      disabled={isGenerating || !selectedDataset}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4" />
                          <span>Generate Metadata with AI</span>
                        </>
                      )}
                    </Button>

                    {isGenerating && <Progress value={generationProgress} className="h-2 mt-2" />}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Uses */}
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Uses</CardTitle>
                  <CardDescription>How this dataset can be used by the public</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suggestedUses.length > 0 ? (
                      suggestedUses.map((use, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                            {index + 1}
                          </div>
                          <p>{use}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>Generate metadata with AI to get suggested uses</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">AI-generated suggestions based on your data</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateMetadata}
                      disabled={isGenerating || !selectedDataset}
                    >
                      Regenerate
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Field Selection */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Public Fields</CardTitle>
                  <CardDescription>Select the fields to include in your open dataset</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Public Data Only
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Include</TableHead>
                        <TableHead>Field Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Sample Values</TableHead>
                        <TableHead className="w-32">Classification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDataset?.fields.map((field) => (
                        <TableRow key={field.id} className={field.classification !== "Public" ? "bg-muted/50" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={selectedFields.some((f) => f.id === field.id)}
                              onCheckedChange={() =>
                                field.classification === "Public" && toggleFieldSelection(field.id)
                              }
                              disabled={field.classification !== "Public"}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{field.column}</TableCell>
                          <TableCell>{field.description}</TableCell>
                          <TableCell>{field.dataType}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {field.classification === "Public" ? (
                              <>
                                {field.sampleValues.slice(0, 3).join(", ")}
                                {field.sampleValues.length > 3 && "..."}
                              </>
                            ) : (
                              <span className="text-muted-foreground italic">Hidden</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                field.classification === "Public"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : field.classification === "Restricted"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : field.classification === "Confidential"
                                      ? "bg-orange-50 text-orange-700 border-orange-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {field.classification === "Public" ? (
                                <Globe className="h-3 w-3 mr-1" />
                              ) : (
                                <Lock className="h-3 w-3 mr-1" />
                              )}
                              {field.classification}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedDataset && selectedDataset.fields.some((f) => f.classification !== "Public") && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Non-public fields are hidden</AlertTitle>
                    <AlertDescription>
                      Fields classified as Restricted, Confidential, or Top Secret cannot be included in open datasets.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Publish</CardTitle>
                <CardDescription>Export your open dataset in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="csv" onValueChange={setExportFormat}>
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="csv" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>CSV</span>
                    </TabsTrigger>
                    <TabsTrigger value="excel" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Excel</span>
                    </TabsTrigger>
                    <TabsTrigger value="json" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>JSON</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="csv" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedFields.length} public fields selected for export as CSV
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        CSV format is ideal for data analysis in spreadsheet applications and statistical software.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="excel" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedFields.length} public fields selected for export as Excel
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Excel format preserves data types and includes metadata in a user-friendly spreadsheet format.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedFields.length} public fields selected for export as JSON
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        JSON format is ideal for developers building applications or data services.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview Dataset</Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={exportDataset}
                  disabled={selectedFields.length === 0}
                >
                  <Download className="h-4 w-4" />
                  <span>Export & Publish</span>
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </Layout>
  )
}
