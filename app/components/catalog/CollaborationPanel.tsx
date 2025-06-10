"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Bookmark, Share2, X, Send, ThumbsUp } from "lucide-react"

interface CollaborationPanelProps {
  dataset: any
  onClose: () => void
}

export function CollaborationPanel({ dataset, onClose }: CollaborationPanelProps) {
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(0)

  const comments = [
    {
      id: 1,
      user: "Ahmed Al-Rashid",
      department: "Marketing",
      comment:
        "This dataset has been very useful for our customer segmentation analysis. The data quality is excellent.",
      timestamp: "2 hours ago",
      likes: 5,
      replies: 2,
    },
    {
      id: 2,
      user: "Dr. Sarah Al-Mahmoud",
      department: "Research",
      comment: "Could we get more recent data? The current dataset ends at 2023.",
      timestamp: "1 day ago",
      likes: 3,
      replies: 1,
    },
    {
      id: 3,
      user: "Omar Al-Saud",
      department: "IT",
      comment: "The API integration works perfectly. Documentation is clear and comprehensive.",
      timestamp: "3 days ago",
      likes: 7,
      replies: 0,
    },
  ]

  const relatedDatasets = [
    { name: "Customer Behavior Analytics", similarity: 92 },
    { name: "Sales Performance Data", similarity: 87 },
    { name: "Market Research Insights", similarity: 84 },
  ]

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 overflow-hidden">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{dataset.name}</h2>
                  <p className="text-gray-600 mt-1">{dataset.nameAr}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge
                      className={`${
                        dataset.classificationEn === "Public"
                          ? "bg-green-100 text-green-800"
                          : dataset.classificationEn === "Restricted"
                            ? "bg-yellow-100 text-yellow-800"
                            : dataset.classificationEn === "Confidential"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dataset.classificationEn}
                    </Badge>
                    <span className="text-sm text-gray-500">by {dataset.owner}</span>
                    <span className="text-sm text-gray-500">{dataset.department}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{dataset.description}</p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{dataset.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Format</p>
                  <p className="font-medium">{dataset.format.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{dataset.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quality Score</p>
                  <p className="font-medium">{dataset.qualityScore}%</p>
                </div>
              </div>

              {/* Schema Preview */}
              <div>
                <h3 className="font-semibold mb-2">Schema</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3">Column</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Classification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.schema.slice(0, 5).map((col: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 font-medium">{col.name}</td>
                          <td className="p-3">{col.type}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{col.classification}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="font-semibold mb-4">Comments & Reviews</h3>

                {/* Add Comment */}
                <div className="border rounded-lg p-4 mb-4">
                  <Textarea
                    placeholder="Share your thoughts about this dataset..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rate this dataset:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {comment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{comment.user}</span>
                            <Badge variant="secondary" className="text-xs">
                              {comment.department}
                            </Badge>
                            <span className="text-sm text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.comment}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-gray-500 hover:text-blue-600">Reply ({comment.replies})</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-gray-50 p-6 space-y-6">
            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </Button>
            </div>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-medium">{dataset.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Downloads</span>
                  <span className="font-medium">{dataset.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-medium">{dataset.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-medium">{dataset.reviews}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Datasets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Related Datasets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedDatasets.map((related, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{related.name}</p>
                      <p className="text-xs text-gray-500">{related.similarity}% similar</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dataset.aiInsights.recommendations.map((insight: string, index: number) => (
                  <p key={index} className="text-xs text-gray-600">
                    {insight}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
