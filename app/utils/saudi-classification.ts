import type { ClassificationResult } from "../types"

interface ImpactAssessment {
  nationalInterest: {
    reputation: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    diplomaticRelations: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    nationalEconomy: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    nationalInfrastructure: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    governmentOperations: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  }
  organizationalActivities: {
    privateEntityProfits: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    privateEntityOperations: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  }
  individuals: {
    healthSafety: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    privacy: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
    intellectualProperty: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  }
  environment: {
    environmentalResources: "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر"
  }
}

export function classifyDataAccordingToSaudiPolicy(columnName: string, sampleData: any[]): ClassificationResult {
  const columnLower = columnName.toLowerCase()
  const columnArabic = columnName

  // Assess impact based on Saudi policy criteria
  const impactAssessment = assessImpact(columnName, sampleData)
  const highestImpact = getHighestImpactLevel(impactAssessment)

  let classification: ClassificationResult["classification"] = "عام"
  let classificationEn: ClassificationResult["classificationEn"] = "Public"
  let justification = ""
  let impactCategories: string[] = []

  // Classification logic based on Saudi policy
  if (highestImpact === "عالي") {
    classification = "سري للغاية"
    classificationEn = "Top Secret"
    justification =
      "تحتوي على بيانات حساسة للغاية قد تؤدي إلى ضرر جسيم واستثنائي لا يمكن تداركه على المصالح الوطنية أو صحة وسلامة الأفراد على نطاق واسع"
    impactCategories = getImpactCategories(impactAssessment, "عالي")
  } else if (highestImpact === "متوسط") {
    classification = "سري"
    classificationEn = "Confidential"
    justification =
      "تحتوي على بيانات سرية قد تؤدي إلى ضرر جسيم على المصالح الوطنية أو أنشطة الجهات أو صحة وسلامة الأفراد"
    impactCategories = getImpactCategories(impactAssessment, "متوسط")
  } else if (highestImpact === "منخفض") {
    classification = "مقيد"
    classificationEn = "Restricted"
    justification =
      "تحتوي على بيانات تتطلب حماية خاصة ولكن لا تشكل تهديداً خطيراً، قد تؤدي إلى تأثير سلبي محدود على عمل الجهات أو الأفراد"
    impactCategories = getImpactCategories(impactAssessment, "منخفض")
  } else {
    classification = "عام"
    classificationEn = "Public"
    justification =
      "بيانات عامة لا يترتب على الوصول غير المصرح به إليها أو الإفصاح عنها أي ضرر على المصالح الوطنية أو الأفراد"
    impactCategories = []
  }

  // Generate description based on column analysis
  const description = generateColumnDescription(columnName, sampleData)

  return {
    column: columnName,
    classification,
    classificationEn,
    justification,
    description,
    impactLevel: highestImpact,
    impactCategory: impactCategories,
  }
}

function assessImpact(columnName: string, sampleData: any[]): ImpactAssessment {
  const columnLower = columnName.toLowerCase()
  const sampleString = sampleData.join(" ").toLowerCase()

  const assessment: ImpactAssessment = {
    nationalInterest: {
      reputation: "لا يوجد أثر",
      diplomaticRelations: "لا يوجد أثر",
      nationalEconomy: "لا يوجد أثر",
      nationalInfrastructure: "لا يوجد أثر",
      governmentOperations: "لا يوجد أثر",
    },
    organizationalActivities: {
      privateEntityProfits: "لا يوجد أثر",
      privateEntityOperations: "لا يوجد أثر",
    },
    individuals: {
      healthSafety: "لا يوجد أثر",
      privacy: "لا يوجد أثر",
      intellectualProperty: "لا يوجد أثر",
    },
    environment: {
      environmentalResources: "لا يوجد أثر",
    },
  }

  // National Interest Assessment
  if (
    columnLower.includes("national") ||
    columnLower.includes("passport") ||
    columnLower.includes("military") ||
    columnLower.includes("security") ||
    columnLower.includes("intelligence") ||
    columnLower.includes("iqama") ||
    columnLower.includes("civil_id")
  ) {
    assessment.nationalInterest.reputation = "عالي"
    assessment.nationalInterest.diplomaticRelations = "عالي"
    assessment.nationalInterest.governmentOperations = "عالي"
  }

  if (
    columnLower.includes("economic") ||
    columnLower.includes("financial") ||
    columnLower.includes("budget") ||
    columnLower.includes("revenue")
  ) {
    assessment.nationalInterest.nationalEconomy = "متوسط"
  }

  if (
    columnLower.includes("infrastructure") ||
    columnLower.includes("energy") ||
    columnLower.includes("power") ||
    columnLower.includes("telecommunications")
  ) {
    assessment.nationalInterest.nationalInfrastructure = "عالي"
  }

  // Individual Privacy and Safety Assessment
  if (
    columnLower.includes("id") ||
    columnLower.includes("national_id") ||
    columnLower.includes("passport") ||
    columnLower.includes("biometric") ||
    columnLower.includes("fingerprint")
  ) {
    assessment.individuals.privacy = "عالي"
  }

  if (
    columnLower.includes("name") ||
    columnLower.includes("phone") ||
    columnLower.includes("email") ||
    columnLower.includes("address") ||
    columnLower.includes("location")
  ) {
    assessment.individuals.privacy = "متوسط"
  }

  if (
    columnLower.includes("medical") ||
    columnLower.includes("health") ||
    columnLower.includes("disease") ||
    columnLower.includes("treatment")
  ) {
    assessment.individuals.healthSafety = "عالي"
    assessment.individuals.privacy = "عالي"
  }

  if (columnLower.includes("salary") || columnLower.includes("income") || columnLower.includes("wage")) {
    assessment.individuals.privacy = "منخفض"
    assessment.organizationalActivities.privateEntityOperations = "منخفض"
  }

  // Organizational Activities Assessment
  if (
    columnLower.includes("profit") ||
    columnLower.includes("revenue") ||
    columnLower.includes("financial") ||
    columnLower.includes("contract")
  ) {
    assessment.organizationalActivities.privateEntityProfits = "متوسط"
  }

  if (
    columnLower.includes("strategy") ||
    columnLower.includes("plan") ||
    columnLower.includes("operation") ||
    columnLower.includes("internal")
  ) {
    assessment.organizationalActivities.privateEntityOperations = "منخفض"
  }

  // Environmental Assessment
  if (
    columnLower.includes("environment") ||
    columnLower.includes("pollution") ||
    columnLower.includes("waste") ||
    columnLower.includes("natural")
  ) {
    assessment.environment.environmentalResources = "متوسط"
  }

  return assessment
}

function getHighestImpactLevel(assessment: ImpactAssessment): "عالي" | "متوسط" | "منخفض" | "لا يوجد أثر" {
  const allImpacts = [
    ...Object.values(assessment.nationalInterest),
    ...Object.values(assessment.organizationalActivities),
    ...Object.values(assessment.individuals),
    ...Object.values(assessment.environment),
  ]

  if (allImpacts.includes("عالي")) return "عالي"
  if (allImpacts.includes("متوسط")) return "متوسط"
  if (allImpacts.includes("منخفض")) return "منخفض"
  return "لا يوجد أثر"
}

function getImpactCategories(assessment: ImpactAssessment, level: string): string[] {
  const categories: string[] = []

  Object.entries(assessment.nationalInterest).forEach(([key, value]) => {
    if (value === level) categories.push(`المصالح الوطنية - ${key}`)
  })

  Object.entries(assessment.organizationalActivities).forEach(([key, value]) => {
    if (value === level) categories.push(`أنشطة الجهات - ${key}`)
  })

  Object.entries(assessment.individuals).forEach(([key, value]) => {
    if (value === level) categories.push(`الأفراد - ${key}`)
  })

  Object.entries(assessment.environment).forEach(([key, value]) => {
    if (value === level) categories.push(`البيئة - ${key}`)
  })

  return categories
}

function generateColumnDescription(columnName: string, sampleData: any[]): string {
  const columnLower = columnName.toLowerCase()

  if (columnLower.includes("name") || columnLower.includes("اسم")) {
    return "يحتوي على أسماء الأشخاص أو المعرفات الشخصية"
  }

  if (columnLower.includes("id") || columnLower.includes("هوية")) {
    return "يحتوي على أرقام الهوية أو المعرفات الفريدة"
  }

  if (columnLower.includes("phone") || columnLower.includes("mobile") || columnLower.includes("هاتف")) {
    return "يحتوي على أرقام الهواتف أو وسائل الاتصال"
  }

  if (columnLower.includes("email") || columnLower.includes("بريد")) {
    return "يحتوي على عناوين البريد الإلكتروني"
  }

  if (columnLower.includes("address") || columnLower.includes("عنوان")) {
    return "يحتوي على العناوين أو معلومات الموقع"
  }

  if (columnLower.includes("salary") || columnLower.includes("راتب")) {
    return "يحتوي على معلومات الرواتب أو البيانات المالية"
  }

  if (columnLower.includes("medical") || columnLower.includes("health") || columnLower.includes("طبي")) {
    return "يحتوي على معلومات طبية أو صحية"
  }

  if (columnLower.includes("date") || columnLower.includes("تاريخ")) {
    return "يحتوي على معلومات التاريخ والوقت"
  }

  // Generate description from sample data
  if (sampleData.length > 0) {
    const firstSample = String(sampleData[0])
    if (firstSample.includes("@")) {
      return "يحتوي على عناوين البريد الإلكتروني"
    }
    if (/^\d{10,}$/.test(firstSample)) {
      return "يحتوي على أرقام طويلة (قد تكون أرقام هوية أو هواتف)"
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(firstSample)) {
      return "يحتوي على تواريخ بصيغة MM/DD/YYYY"
    }
  }

  const samplePreview = sampleData.slice(0, 3).join("، ")
  return `عينة من البيانات: ${samplePreview}${sampleData.length > 3 ? "..." : ""}`
}
