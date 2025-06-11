"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Tag, FileSpreadsheet, Columns } from "lucide-react"

// Updated interface to match TableMetadata
interface TableMetadata {
  id: string
  dataSource: string
  tableName: string
  tableNameAr: string
  columns: ColumnMetadata[] // Added
  owner: string
  description: string
  descriptionAr: string
  classification: "عام" | "مقيد" | "سري" | "سري للغاية"
  classificationEn: "Public" | "Restricted" | "Confidential" | "Top Secret"
  tags: string[]
  tagsAr: string[]
  size: string
  lastUpdated: string
  format: string[]
  qualityScore: number
  popularity: number // Assuming this is still relevant or can be derived
  views: number
  downloads: number
  rating: number
  reviews: number
}

interface ColumnMetadata {
  // Added
  name: string
  dataType: string
  isPK: boolean
  isFK: boolean
  fkTable?: string
  fkColumn?: string
  description: string
}

interface DatasetCardProps {
  dataset: TableMetadata // Changed from Dataset to TableMetadata
  viewMode: "grid" | "list"
  onSelect: (dataset: TableMetadata) => void // Changed from Dataset to TableMetadata
  getClassificationColor: (classification: string) => string
}

export function DatasetCard({ dataset, viewMode, onSelect, getClassificationColor }: DatasetCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(dataset)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate" title={dataset.tableName}>
                    {dataset.tableName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate" title={dataset.dataSource}>
                    Source: {dataset.dataSource}
                  </p>
                </div>
                <Badge className={getClassificationColor(dataset.classificationEn)}>{dataset.classificationEn}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2" title={dataset.description}>
                {dataset.description}
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center" title={`Owner: ${dataset.owner}`}>
                  <Users className="h-4 w-4 mr-1" />
                  {dataset.owner}
                </span>
                <span className="flex items-center" title={`Last Updated: ${dataset.lastUpdated}`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {dataset.lastUpdated}
                </span>
                <span className="flex items-center" title={`Columns: ${dataset.columns.length}`}>
                  <Columns className="h-4 w-4 mr-1" />
                  {dataset.columns.length} Columns
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(dataset)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(dataset)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate" title={dataset.tableName}>
              {dataset.tableName}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 truncate" title={dataset.dataSource}>
              Source: {dataset.dataSource}
            </CardDescription>
          </div>
          <Badge className={getClassificationColor(dataset.classificationEn)}>{dataset.classificationEn}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2" title={dataset.description}>
          {dataset.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {dataset.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{dataset.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t">
          <div>
            <p className="text-gray-500">Owner</p>
            <p className="font-medium truncate" title={dataset.owner}>
              {dataset.owner}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Columns</p>
            <p className="font-medium">{dataset.columns.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{dataset.size}</p>
          </div>
          <div>
            <p className="text-gray-500">Quality</p>
            <div className="flex items-center">
              <div className="w-10 bg-gray-200 rounded-full h-2 mr-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${dataset.qualityScore}%` }}></div>
              </div>
              <span className="font-medium text-xs">{dataset.qualityScore}%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-4 border-t mt-auto">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(dataset)
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}
