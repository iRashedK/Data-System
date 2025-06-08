export interface ClassificationResult {
  column: string
  classification: "سري للغاية" | "سري" | "مقيد" | "عام"
  classificationEn: "Top Secret" | "Confidential" | "Restricted" | "Public"
  justification: string
  description?: string
  impactLevel: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  impactCategory: string[]
}

export interface TableClassification {
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
