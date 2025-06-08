export interface ClassificationResult {
  column: string
  classification: "Top Secret" | "Confidential" | "Restricted" | "Public"
  justification: string
}
