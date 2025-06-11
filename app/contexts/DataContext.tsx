"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { TableMetadata } from "@/app/types" // Ensure this path is correct

interface DataContextType {
  processedDataSources: TableMetadata[]
  addProcessedDataSource: (dataSource: TableMetadata) => void
  updateTableMetadata: (updatedTable: TableMetadata) => void
  getTableById: (id: string) => TableMetadata | undefined
  // Add more functions as needed, e.g., for updating specific column metadata
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processedDataSources, setProcessedDataSources] = useState<TableMetadata[]>([])

  const addProcessedDataSource = useCallback((dataSource: TableMetadata) => {
    setProcessedDataSources((prevSources) => {
      // Avoid duplicates by checking ID, or update if exists
      const existingIndex = prevSources.findIndex((src) => src.id === dataSource.id)
      if (existingIndex !== -1) {
        const updatedSources = [...prevSources]
        updatedSources[existingIndex] = dataSource
        return updatedSources
      }
      return [...prevSources, dataSource]
    })
  }, [])

  const updateTableMetadata = useCallback((updatedTable: TableMetadata) => {
    setProcessedDataSources((prevSources) =>
      prevSources.map((table) => (table.id === updatedTable.id ? updatedTable : table)),
    )
  }, [])

  const getTableById = useCallback(
    (id: string) => {
      return processedDataSources.find((table) => table.id === id)
    },
    [processedDataSources],
  )

  return (
    <DataContext.Provider value={{ processedDataSources, addProcessedDataSource, updateTableMetadata, getTableById }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
