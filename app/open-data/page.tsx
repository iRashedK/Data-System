"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Globe, FileText, Download, FileSpreadsheet, Code, Tag, Plus, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample public data fields
const publicFields = [
  {
    id: 1,
    column: "service_name",
    description: "Name of the public service",
    dataType: "string",
    sampleValues: ["Health Services", "Education", "Transportation", "Public Safety"],
    selected: true,
  },
  {
    id: 2,
    column: "city",
    description: "City where the service is provided",
    dataType: "string",
    sampleValues: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
    selected: true,
  },
  {
    id: 3,
    column: "sector",
    description: "Sector classification",
    dataType: "string",
    sampleValues: ["Healthcare", "Education", "Transportation", "Security"],
    selected: true,
  },
  {
    id: 4,
    column: "beneficiaries_count",
    description: "Number of people benefiting from the service",
    dataType: "number",
    sampleValues: [1250, 3400, 5600, 2800],
    selected: true,
  },
  {
    id: 5,
    column: "region",
    description: "Administrative region",
    dataType: "string",
    sampleValues: ["Central", "Western", "Eastern", "Northern", "Southern"],
    selected: false,
  },
  {
    id: 6,
    column: "year",
    description: "Year of data collection",
    dataType: "number",
    sampleValues: [2021, 2022, 2023],
    selected: false,
  },
]

export default function OpenDataPage() {
  const [selectedFields, setSelectedFields] = useState(publicFields.filter((field) => field.selected))
  const [datasetTitle, setDatasetTitle] = useState("Public Services by City")
  const [datasetDescription, setDatasetDescription] = useState(
    "This dataset provides information on public services across different cities in Saudi Arabia, including service names, sectors, and beneficiary counts. The data can be used for analysis of service distribution and planning.",
  )
  const [suggestedUses, setSuggestedUses] = useState([
    "Create interactive dashboards showing service distribution by city",
    "Generate policy reports on service coverage across regions",
    "Develop applications to help citizens locate nearby services",
    "Conduct research on service utilization patterns",
  ])
  const [tags, setTags] = useState(["public-services", "saudi-arabia", "cities", "sectors"])
  const [newTag, setNewTag] = useState("")
  const [exportFormat, setExportFormat] = useState("csv")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Simulate AI generation
  const generateMetadata = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
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
    alert(`Exporting dataset as ${exportFormat.toUpperCase()}`)
    // In a real app, this would trigger the actual export
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Open Data Generator</h1>
            <p className="text-muted-foreground">Create and publish open datasets from your public data</p>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border-green-200"
          >
            <Globe className="h-4 w-4" />
            <span>Ready for Public Use</span>
          </Badge>
        </div>

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
                  disabled={isGenerating}
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
                {suggestedUses.map((use, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                      {index + 1}
                    </div>
                    <p>{use}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">AI-generated suggestions based on your data</span>
                </div>
                <Button variant="ghost" size="sm">
                  Regenerate
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Field Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Public Fields</CardTitle>
            <CardDescription>Select the fields to include in your open dataset</CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publicFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFields.some((f) => f.id === field.id)}
                          onCheckedChange={() => toggleFieldSelection(field.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{field.column}</TableCell>
                      <TableCell>{field.description}</TableCell>
                      <TableCell>{field.dataType}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {field.sampleValues.slice(0, 3).join(", ")}
                        {field.sampleValues.length > 3 && "..."}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

              <div className="mt-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedFields.length} fields selected for export</span>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Preview Dataset</Button>
            <Button className="flex items-center gap-2" onClick={exportDataset}>
              <Download className="h-4 w-4" />
              <span>Export & Publish</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
