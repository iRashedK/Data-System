// Technical and Business metadata for a Column, including classification results
export interface ColumnMetadata {
  name: string
  dataType: string // Technical: Inferred or user-defined data type (e.g., VARCHAR, INT, DATE)
  isPK: boolean // Technical: Is this column a Primary Key?
  isFK: boolean // Technical: Is this column a Foreign Key?
  fkTable?: string // Technical: If FK, which table does it reference?
  fkColumn?: string // Technical: If FK, which column in the fkTable does it reference?

  description: string // Business: AI-generated or user-edited description of the column

  // Classification details from AI/Rules Engine (previously in ClassificationResult)
  classificationLevel?: "Top Secret" | "Confidential" | "Restricted" | "Public"
  classificationLevelAr?: "سري للغاية" | "سري" | "مقيد" | "عام"
  classificationJustification?: string
  classificationRegulation?: string // e.g., PDPL, GDPR
  confidence?: number // Confidence score of the classification

  // Fields from the original ClassificationResult (app/utils/saudi-classification.ts)
  // These might be specific to the Saudi policy or can be generalized
  impactLevel?: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  impactCategory?: string[]
  // 'description' from original ClassificationResult is now the main 'description' field above.
  // 'column' from original ClassificationResult is now 'name'.
  // 'classification' and 'classificationEn' are now 'classificationLevel' and 'classificationLevelEn' (if needed, or just use English consistently)

  // Sample values can be useful for context but might be large.
  // Consider if they should be stored here or fetched on demand.
  sampleValues?: any[]
}

// Technical and Business metadata for a Table (e.g., an Excel Sheet), including classification summary
export interface TableMetadata {
  id: string // Unique ID for this table/sheet instance
  dataSourceName: string // Technical: Name of the source file or database connection
  sourceSystemType: "Excel" | "MySQL" | "PostgreSQL" | "API" | "Other" // Type of the data source

  tableName: string // Technical: Name of the table or sheet
  tableNameAr?: string // Business: Arabic name for the table/sheet

  columns: ColumnMetadata[]

  owner: string // Business: User who uploaded/connected the data source
  description: string // Business: AI-generated or user-edited description for the table/sheet
  descriptionAr?: string // Business

  // Table-level overall classification (derived from column classifications)
  overallClassificationLevel?: "Top Secret" | "Confidential" | "Restricted" | "Public"
  overallClassificationLevelAr?: "سري للغاية" | "سري" | "مقيد" | "عام"
  overallClassificationJustification?: string
  riskLevel?: "High" | "Medium" | "Low" // Derived risk based on column classifications

  // Fields from original TableClassification
  columnCount: number
  sensitiveColumnCount: number
  impactAssessment?: {
    nationalInterest: boolean
    organizationalActivities: boolean
    individualSafety: boolean
    environmentalResources: boolean
  }

  // Other metadata from Data Catalog
  tags?: string[]
  tagsAr?: string[]
  size?: string // e.g., "1.2 MB" or row count
  rowCount?: number
  lastUpdated: string // ISO date string
  createdAt: string // ISO date string
  qualityScore?: number // 0-100

  // Fields from original Dataset interface in data-catalog/page.tsx if still needed
  popularity?: number
  views?: number
  downloads?: number
  rating?: number
  reviews?: number
  compliance?: { gdpr: boolean; pdpl: boolean; iso27001: boolean }
  lineage?: { upstream: string[]; downstream: string[] }
  aiInsights?: {
    suggestedTags?: string[]
    qualityIssues?: string[]
    recommendations?: string[]
    similarDatasets?: string[]
  }
}

// Keep original ClassificationResult and TableClassification if they are still used by utility functions
// before being mapped to the new unified model. Otherwise, they can be deprecated.
export interface OriginalClassificationResult {
  column: string
  classification: "سري للغاية" | "سري" | "مقيد" | "عام"
  classificationEn: "Top Secret" | "Confidential" | "Restricted" | "Public"
  justification: string
  description?: string
  impactLevel: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  impactCategory: string[]
}

export interface OriginalTableClassification {
  tableName: string
  classification: "سري للغاية" | "سري" | "مقيد" | "عام"
  classificationEn: "Top Secret" | "Confidential" | "Restricted" | "Public"
  justification: string
  columnCount: number
  sensitiveColumnCount: number
  riskLevel: "High" | "Medium" | "Low"
  impactAssessment: {
    nationalInterest: boolean
    organizationalActivities: boolean
    individualSafety: boolean
    environmentalResources: boolean
  }
}
