"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/classification/FileUploader"
import { DatabaseConnector } from "@/components/classification/DatabaseConnector"
import { FileSpreadsheet, Database, Info, Edit, Eye, Download, Filter, Search } from "lucide-react"

// Sample classification results
const classificationResults = [
  {
    id: 1,
    column: "national_id",
    classification: "Top Secret",
    regulation: "PDPL",
    confidence: 0.98,
    justification:
      "Contains Saudi national identification numbers which are highly sensitive personal identifiers protected under PDPL Article 5.",
  },
  {
    id: 2,
    column: "email_address",
    classification: "Confidential",
    regulation: "GDPR",
    confidence: 0.95,
    justification: "Contains personal email addresses which are considered personal data under GDPR Article 4.",
  },
  {
    id: 3,
    column: "full_name",
    classification: "Confidential",
    regulation: "PDPL",
    confidence: 0.92,
    justification: "Contains personal names which are protected under Saudi PDPL regulations.",
  },
  {
    id: 4,
    column: "department",
    classification: "Internal",
    regulation: "DAMA",
    confidence: 0.87,
    justification: "Contains internal organizational structure information that should be restricted to internal use.",
  },
  {
    id: 5,
    column: "service_name",
    classification: "Public",
    regulation: "DAMA",
    confidence: 0.99,
    justification: "Contains public service information with no restrictions under data management frameworks.",
  },
  {
    id: 6,
    column: "city",
    classification: "Public",
    regulation: "DAMA",
    confidence: 0.99,
    justification: "Contains public geographic information with no restrictions.",
  },
  {
    id: 7,
    column: "sector",
    classification: "Public",
    regulation: "DAMA",
    confidence: 0.98,
    justification: "Contains public sector categorization with no restrictions.",
  },
  {
    id: 8,
    column: "beneficiaries_count",
    classification: "Public",
    regulation: "DAMA",
    confidence: 0.95,
    justification: "Contains aggregated statistical data with no personal information.",
  },
]

export default function ClassificationPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClassification, setFilterClassification] = useState("all")

  const filteredResults = classificationResults.filter((result) => {
    const matchesSearch = result.column.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterClassification === "all" || result.classification === filterClassification
    return matchesSearch && matchesFilter
  })

  const getBadgeColor = (classification: string) => {
    switch (classification) {
      case "Top Secret":
        return "destructive"
      case "Confidential":
        return "warning"
      case "Internal":
        return "secondary"
      case "Public":
        return "default"
      default:
        return "outline"
    }
  }

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
            <FileUploader />
          </TabsContent>

          <TabsContent value="database" className="mt-4">
            <DatabaseConnector />
          </TabsContent>
        </Tabs>

        {/* Classification Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Classification Results</CardTitle>
              <CardDescription>Review and manage your classified data columns</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
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
                    <SelectItem value="Internal">Internal</SelectItem>
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
                    <TableHead>Classification</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.column}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeColor(result.classification)}>{result.classification}</Badge>
                      </TableCell>
                      <TableCell>{result.regulation}</TableCell>
                      <TableCell>{(result.confidence * 100).toFixed(0)}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedResult(result)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Classification</DialogTitle>
                                <DialogDescription>
                                  Update the classification for column "{result.column}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="classification" className="text-right">
                                    Classification
                                  </Label>
                                  <Select defaultValue={result.classification}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Top Secret">Top Secret</SelectItem>
                                      <SelectItem value="Confidential">Confidential</SelectItem>
                                      <SelectItem value="Internal">Internal</SelectItem>
                                      <SelectItem value="Public">Public</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="regulation" className="text-right">
                                    Regulation
                                  </Label>
                                  <Select defaultValue={result.regulation}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PDPL">PDPL</SelectItem>
                                      <SelectItem value="GDPR">GDPR</SelectItem>
                                      <SelectItem value="NDMO">NDMO</SelectItem>
                                      <SelectItem value="NCA">NCA</SelectItem>
                                      <SelectItem value="DAMA">DAMA</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="justification" className="text-right">
                                    Justification
                                  </Label>
                                  <Input
                                    id="justification"
                                    defaultValue={result.justification}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">{result.justification}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
