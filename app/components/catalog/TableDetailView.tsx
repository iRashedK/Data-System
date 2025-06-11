"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KeyRound, Link2, Edit3, Save, Info, FileSpreadsheet, Users, Sheet } from "lucide-react"

interface ColumnMetadata {
  name: string
  dataType: string
  isPK: boolean
  isFK: boolean
  fkTable?: string
  fkColumn?: string
  description: string
  // Add other relevant fields if needed, e.g., classification from original data
  originalClassification?: string
}

interface TableMetadata {
  id: string
  dataSource: string
  tableName: string
  tableNameAr: string
  columns: ColumnMetadata[]
  owner: string
  description: string
  descriptionAr: string
  classificationEn: "Public" | "Restricted" | "Confidential" | "Top Secret"
  // Add other relevant fields
}

interface TableDetailViewProps {
  table: TableMetadata | null
  isOpen: boolean
  onClose: () => void
  onUpdateDescription: (
    tableId: string,
    columnDescriptionUpdates: { columnName: string; newDescription: string }[],
    tableDescription?: string,
  ) => void
}

export function TableDetailView({ table, isOpen, onClose, onUpdateDescription }: TableDetailViewProps) {
  const [editableTableDesc, setEditableTableDesc] = useState(table?.description || "")
  const [editableColumnDescs, setEditableColumnDescs] = useState<Record<string, string>>({})
  const [editingTableDesc, setEditingTableDesc] = useState(false)
  const [editingColumnDesc, setEditingColumnDesc] = useState<string | null>(null) // Stores name of column being edited

  // Effect to reset editable states when table changes or modal opens
  useState(() => {
    if (table) {
      setEditableTableDesc(table.description)
      const initialColumnDescs: Record<string, string> = {}
      table.columns.forEach((col) => {
        initialColumnDescs[col.name] = col.description
      })
      setEditableColumnDescs(initialColumnDescs)
    }
    setEditingTableDesc(false)
    setEditingColumnDesc(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, isOpen])

  if (!table) return null

  const handleSaveDescriptions = () => {
    const columnUpdates = Object.entries(editableColumnDescs)
      .filter(([columnName, newDescription]) => {
        const originalColumn = table.columns.find((c) => c.name === columnName)
        return originalColumn && originalColumn.description !== newDescription
      })
      .map(([columnName, newDescription]) => ({ columnName, newDescription }))

    let tableDescUpdate: string | undefined = undefined
    if (table.description !== editableTableDesc) {
      tableDescUpdate = editableTableDesc
    }

    if (columnUpdates.length > 0 || tableDescUpdate !== undefined) {
      onUpdateDescription(table.id, columnUpdates, tableDescUpdate)
    }
    setEditingTableDesc(false)
    setEditingColumnDesc(null)
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sheet className="h-6 w-6 mr-2 text-primary" />
            {table.tableName}
            <Badge className={`ml-3 ${getClassificationColor(table.classificationEn)}`}>{table.classificationEn}</Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed metadata for table "{table.tableNameAr}" from data source "{table.dataSource}".
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden flex flex-col space-y-4 pr-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center justify-between">
                <span>Business Metadata</span>
                <Button variant="ghost" size="sm" onClick={() => setEditingTableDesc(!editingTableDesc)}>
                  <Edit3 className="h-4 w-4 mr-1" /> {editingTableDesc ? "Cancel" : "Edit"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex">
                <strong className="w-28 flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-gray-500" />
                  Data Source:
                </strong>
                <span>{table.dataSource}</span>
              </div>
              <div className="flex">
                <strong className="w-28 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  Owner:
                </strong>
                <span>{table.owner}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <strong className="w-28 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    Description:
                  </strong>
                </div>
                {editingTableDesc ? (
                  <Textarea
                    value={editableTableDesc}
                    onChange={(e) => setEditableTableDesc(e.target.value)}
                    placeholder="Enter table description (AI-assisted)"
                    className="mt-1 text-sm"
                  />
                ) : (
                  <p className="text-gray-700 mt-1 pl-6">
                    {editableTableDesc || "No description provided. Click 'Edit' to add one."}
                  </p>
                )}
                {/* AI Suggestion Placeholder */}
                {editingTableDesc && (
                  <p className="text-xs text-blue-500 mt-1 pl-6">
                    AI suggestion: "{table.description} (enhanced with details about its primary use cases)."
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-grow flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Technical Metadata - Columns ({table.columns.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-full">
                {" "}
                {/* Make ScrollArea take remaining height */}
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Column Name</TableHead>
                      <TableHead className="w-[100px]">Data Type</TableHead>
                      <TableHead className="w-[50px] text-center">PK</TableHead>
                      <TableHead className="w-[50px] text-center">FK</TableHead>
                      <TableHead className="w-[150px]">FK Target</TableHead>
                      <TableHead>Description (AI Assisted)</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.columns.map((col) => (
                      <TableRow key={col.name}>
                        <TableCell className="font-medium">{col.name}</TableCell>
                        <TableCell>{col.dataType}</TableCell>
                        <TableCell className="text-center">
                          {col.isPK && (
                            <KeyRound className="h-4 w-4 text-yellow-500 mx-auto" titleAccess="Primary Key" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {col.isFK && <Link2 className="h-4 w-4 text-blue-500 mx-auto" titleAccess="Foreign Key" />}
                        </TableCell>
                        <TableCell>{col.isFK ? `${col.fkTable}.${col.fkColumn}` : "-"}</TableCell>
                        <TableCell>
                          {editingColumnDesc === col.name ? (
                            <Textarea
                              value={editableColumnDescs[col.name] || ""}
                              onChange={(e) =>
                                setEditableColumnDescs({ ...editableColumnDescs, [col.name]: e.target.value })
                              }
                              className="text-xs min-h-[40px]"
                              placeholder="AI-generated description..."
                            />
                          ) : (
                            <span className="line-clamp-2" title={editableColumnDescs[col.name] || col.description}>
                              {editableColumnDescs[col.name] || col.description || "N/A"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingColumnDesc(editingColumnDesc === col.name ? null : col.name)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSaveDescriptions} disabled={!editingTableDesc && !editingColumnDesc}>
            <Save className="h-4 w-4 mr-2" />
            Save Descriptions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
