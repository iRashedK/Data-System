import type { ClassificationResult, TableClassification } from "../types"

export function generateTableClassification(tableName: string, results: ClassificationResult[]): TableClassification {
  // Count columns by classification
  const counts = {
    "سري للغاية": 0,
    سري: 0,
    مقيد: 0,
    عام: 0,
  }

  results.forEach((result) => {
    counts[result.classification]++
  })

  // Determine the highest classification level present (المبدأ الرابع: المستوى الأعلى من الحماية)
  let tableClassification: TableClassification["classification"] = "عام"
  let tableClassificationEn: TableClassification["classificationEn"] = "Public"

  if (counts["سري للغاية"] > 0) {
    tableClassification = "سري للغاية"
    tableClassificationEn = "Top Secret"
  } else if (counts["سري"] > 0) {
    tableClassification = "سري"
    tableClassificationEn = "Confidential"
  } else if (counts["مقيد"] > 0) {
    tableClassification = "مقيد"
    tableClassificationEn = "Restricted"
  }

  // Count sensitive columns (سري للغاية + سري)
  const sensitiveColumnCount = counts["سري للغاية"] + counts["سري"]

  // Determine risk level
  let riskLevel: "High" | "Medium" | "Low" = "Low"
  const sensitiveRatio = sensitiveColumnCount / results.length

  if (counts["سري للغاية"] > 0 || sensitiveRatio > 0.3) {
    riskLevel = "High"
  } else if (counts["سري"] > 0 || sensitiveRatio > 0.1) {
    riskLevel = "Medium"
  }

  // Assess impact categories
  const impactAssessment = {
    nationalInterest: results.some((r) => r.impactCategory.some((cat) => cat.includes("المصالح الوطنية"))),
    organizationalActivities: results.some((r) => r.impactCategory.some((cat) => cat.includes("أنشطة الجهات"))),
    individualSafety: results.some((r) => r.impactCategory.some((cat) => cat.includes("الأفراد"))),
    environmentalResources: results.some((r) => r.impactCategory.some((cat) => cat.includes("البيئة"))),
  }

  // Generate justification based on Saudi policy
  let justification = ""
  if (tableClassification === "سري للغاية") {
    justification = `تحتوي هذه الجدولة على ${counts["سري للغاية"]} عمود مصنف كـ "سري للغاية" مما يتطلب أعلى مستوى من الحماية وفقاً للمادة 5 من نظام حماية البيانات الشخصية السعودي. يجب التعامل مع الجدولة بأكملها كبيانات سرية للغاية لحماية المصالح الوطنية.`
  } else if (tableClassification === "سري") {
    justification = `تحتوي هذه الجدولة على ${counts["سري"]} عمود مصنف كـ "سري" مما يتطلب حماية خاصة وفقاً للمواد 12-14 من نظام حماية البيانات الشخصية السعودي. يجب التعامل مع الجدولة بأكملها كبيانات سرية.`
  } else if (tableClassification === "مقيد") {
    justification = `تحتوي هذه الجدولة على ${counts["مقيد"]} عمود مصنف كـ "مقيد" مما يتطلب تطبيق ضوابط الحماية الأساسية وفقاً لنظام حماية البيانات الشخصية السعودي.`
  } else {
    justification = `تحتوي هذه الجدولة على بيانات عامة فقط ولا توجد قيود خاصة وفقاً لسياسة تصنيف البيانات السعودية.`
  }

  return {
    tableName,
    classification: tableClassification,
    classificationEn: tableClassificationEn,
    justification,
    columnCount: results.length,
    sensitiveColumnCount,
    riskLevel,
    impactAssessment,
  }
}
