import { getClassificationPrompt } from "./classification-prompt"
import type { ClassificationResult } from "../types"

export async function classifyWithAI(
  columnName: string,
  sampleData: any[],
  apiKey: string,
): Promise<ClassificationResult> {
  try {
    // Format sample data as strings
    const sampleStrings = sampleData.filter((item) => item !== null && item !== undefined).map((item) => String(item))

    // Generate the prompt
    const prompt = getClassificationPrompt(columnName, sampleStrings)

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus", // High accuracy model
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.choices[0]?.message?.content

    if (!content) {
      throw new Error("Invalid API response")
    }

    // Parse the JSON response
    const classification = JSON.parse(content)

    return {
      column: classification.column,
      classification: classification.classification,
      justification: classification.justification,
    }
  } catch (error) {
    console.error("AI classification error:", error)

    // Fallback to rule-based classification
    return fallbackClassification(columnName, sampleData)
  }
}

// Fallback classification function when AI is unavailable
function fallbackClassification(columnName: string, sampleData: any[]): ClassificationResult {
  const columnLower = columnName.toLowerCase()

  // Enhanced classification rules based on Saudi regulations
  if (
    columnLower.includes("national") ||
    columnLower.includes("id") ||
    columnLower.includes("passport") ||
    columnLower.includes("iqama") ||
    columnLower.includes("civil_id") ||
    columnLower.includes("ssn") ||
    columnLower.includes("biometric") ||
    columnLower.includes("fingerprint")
  ) {
    return {
      column: columnName,
      classification: "Top Secret",
      justification:
        "Contains national identification data protected under Saudi PDPL Article 5 as highly sensitive personal data.",
    }
  }

  if (
    columnLower.includes("phone") ||
    columnLower.includes("mobile") ||
    columnLower.includes("email") ||
    columnLower.includes("address") ||
    columnLower.includes("location") ||
    columnLower.includes("gps") ||
    columnLower.includes("coordinates") ||
    columnLower.includes("financial") ||
    columnLower.includes("bank")
  ) {
    return {
      column: columnName,
      classification: "Confidential",
      justification:
        "Contains personal contact or financial information requiring explicit consent and protection under Saudi PDPL Articles 12-14.",
    }
  }

  if (
    columnLower.includes("name") ||
    columnLower.includes("birth") ||
    columnLower.includes("age") ||
    columnLower.includes("gender") ||
    columnLower.includes("salary") ||
    columnLower.includes("medical") ||
    columnLower.includes("health") ||
    columnLower.includes("income") ||
    columnLower.includes("employee")
  ) {
    return {
      column: columnName,
      classification: "Restricted",
      justification:
        "Contains personal demographic or employment data requiring basic protection under Saudi PDPL with standard consent requirements.",
    }
  }

  return {
    column: columnName,
    classification: "Public",
    justification: "General business data with no specific restrictions under Saudi PDPL or NDMO regulations.",
  }
}
