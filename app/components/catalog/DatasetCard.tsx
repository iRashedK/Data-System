"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye, Download, Share2, Clock, Users, BarChart3, Tag } from "lucide-react"

interface Dataset {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  classification: string
  classificationEn: string
  owner: string
  department: string
  tags: string[]
  tagsAr: string[]
  size: string
  lastUpdated: string
  format: string[]
  qualityScore: number
  popularity: number
  views: number
  downloads: number
  rating: number
  reviews: number
}

interface DatasetCardProps {
  dataset: Dataset
  viewMode: "grid" | "list"
  onSelect: (dataset: Dataset) => void
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
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{dataset.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{dataset.nameAr}</p>
                </div>
                <Badge className={getClassificationColor(dataset.classificationEn)}>{dataset.classificationEn}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{dataset.description}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {dataset.owner}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {dataset.lastUpdated}
                </span>
                <span className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  {dataset.qualityScore}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                {dataset.views}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                {dataset.downloads}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(dataset)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{dataset.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{dataset.nameAr}</CardDescription>
          </div>
          <Badge className={getClassificationColor(dataset.classificationEn)}>{dataset.classificationEn}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{dataset.description}</p>

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

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Owner</p>
            <p className="font-medium">{dataset.owner}</p>
          </div>
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-medium">{dataset.department}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{dataset.size}</p>
          </div>
          <div>
            <p className="text-gray-500">Quality Score</p>
            <div className="flex items-center">
              <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${dataset.qualityScore}%` }}></div>
              </div>
              <span className="font-medium">{dataset.qualityScore}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {dataset.views}
            </span>
            <span className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              {dataset.downloads}
            </span>
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {dataset.rating}
            </span>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
