export const getClassificationPrompt = (columnName: string, sampleData: string[]) => {
  const sampleDataFormatted = sampleData.map((item) => `- ${item}`).join("\n")

  return `# Saudi Data Classification Task

## Context
You are a senior data governance officer at the Saudi National Data Management Office (NDMO). Your task is to classify data according to the Saudi Personal Data Protection Law (PDPL) and the NDMO Data Classification Framework.

## Column Information
Column Name: "${columnName}"

Sample Data:
${sampleDataFormatted}

## Classification Framework
Classify this data into EXACTLY ONE of these categories:

### 🔴 TOP SECRET
- Definition: Highly sensitive data that could threaten national security or cause severe damage to the Kingdom's strategic interests if disclosed
- Examples: National IDs, passport numbers, biometric data, military/intelligence information
- Legal basis: Highest protection under Saudi PDPL Article 5 and National Cybersecurity Authority regulations
- Requires: Encryption at rest and in transit, strict access controls, DLP monitoring

### 🟠 CONFIDENTIAL
- Definition: Sensitive personal or organizational data that could cause significant harm if disclosed
- Examples: Phone numbers, email addresses, physical addresses, financial records, location data
- Legal basis: Protected under Saudi PDPL Articles 12-14 requiring explicit consent and protection
- Requires: Access controls, audit logging, data minimization

### 🟡 RESTRICTED
- Definition: Data requiring special protection but not posing serious threats if disclosed
- Examples: Names, birth dates, employment information, non-sensitive medical information
- Legal basis: Basic protection under Saudi PDPL with standard consent requirements
- Requires: Basic access controls and standard security measures

### 🔵 PUBLIC
- Definition: Data that can be freely shared without restrictions
- Examples: Public business information, non-personal statistics, published reports
- Legal basis: No specific restrictions under Saudi PDPL
- Requires: Integrity protection only

## Instructions
1. Analyze the column name and sample data carefully
2. Consider Saudi cultural and legal context
3. When in doubt, choose the more restrictive classification
4. Provide a clear justification based on Saudi regulations
5. Include a brief description of what the column appears to contain

## Response Format
Respond ONLY with a valid JSON object in this exact format:
{
  "column": "${columnName}",
  "classification": "Top Secret | Confidential | Restricted | Public",
  "justification": "Brief explanation referencing Saudi PDPL or NDMO regulations",
  "description": "Brief description of what this column contains based on the sample data"
}`
}
