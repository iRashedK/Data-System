"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Sparkles, Clock, TrendingUp } from "lucide-react"

interface SmartSearchProps {
  value: string
  onChange: (value: string) => void
  datasets: any[]
}

export function SmartSearch({ value, onChange, datasets }: SmartSearchProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])

  useEffect(() => {
    // Generate popular tags from datasets
    const tagCounts = datasets.reduce(
      (acc, dataset) => {
        dataset.tags.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const popular = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag]) => tag)

    setPopularTags(popular)
  }, [datasets])

  useEffect(() => {
    if (value.length > 2) {
      // AI-powered search suggestions
      const suggestions = [
        `${value} datasets`,
        `${value} in finance`,
        `${value} public data`,
        `${value} high quality`,
        `recent ${value} data`,
      ]
      setSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  const handleSearch = (searchTerm: string) => {
    onChange(searchTerm)
    setShowSuggestions(false)

    // Add to recent searches
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search datasets with AI assistance... (e.g., 'customer data', 'financial reports')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(value.length > 2)}
          className="pl-10 pr-12"
        />
        <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <Sparkles className="h-4 w-4 text-purple-500" />
        </Button>
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-3">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                  AI Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Recent Searches
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Popular Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {popularTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSearch(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
