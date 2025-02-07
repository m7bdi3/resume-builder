"use server";

import {
  GenerateAtsInput,
  generateAtsSchema,
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAiTools } from "@/lib/permissions";
import { model } from "@/lib/gemini";
// import openai from "@/lib/openai";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const { jobTitle, workExperience, educations, skills, jobDescription } =
    generateSummarySchema.parse(input);

  const prompt = `
    You are an advanced AI specialized in writing professional resume summaries. 
    Given the user's data below, write a concise, impactful summary for a resume. 
    work on a better prompt to transform job snippets into comprehensive work experiences, emphasizing real achievements with specific metrics and avoiding fictional data.
   analyze how to transform a brief work experience into a detailed narrative, ensuring a complete, bullet-pointed description in JSON format, adhering to the user's guidelines.
   integrate missing details while maintaining accuracy, ensuring the completion of the work experience narrative with a professional tone, free from fictional content.
    enrich work experiences with logical details and professional language, ensuring they remain accurate and forward-looking.
     refine the prompt to create a comprehensive, bullet-pointed work experience entry. This will ensure it’s factual, logically expanded, and professionally written, avoiding any fictional data.
      refine the approach to maintain a clear, factual narrative by setting unknown dates to null and carefully inferring or expanding details, ensuring no fictional data is included. This ensures progress in maintaining precision.
    **Important**:
    - Return only the final summary text (no additional explanations or placeholders).
    - Omit any mention of missing data (like "N/A")—just skip fields that have no data.
    - Keep it professional and well-structured, ideally in 2-4 sentences.
    - Focus on key strengths, relevant experience, and skills to position the candidate effectively.
    
  ${(jobDescription?.length ?? 0) > 1 ? `- compare it with job description requirements and keywords ${jobDescription} ` : ``}
  

    User data:
    - Job Title: ${jobTitle || ""}
    - Work Experiences:
      ${workExperience
        ?.map(
          (exp) => `
          Position: ${exp.position || ""}
          Company: ${exp.company || ""}
          Duration: ${exp.startDate || ""} to ${exp.endDate || "Present"}
          Description: ${exp.description || ""}
        `
        )
        .join("\n")}
    - Education:
      ${educations
        ?.map(
          (edu) => `
          Degree: ${edu.degree || ""}
          Institution: ${edu.school || ""}
          Duration: ${edu.startDate || ""} to ${edu.endDate || ""}
        `
        )
        .join("\n")}
    - Skills: ${skills?.join(", ") || ""}
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return aiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}

// export async function DgenerateSummary(input: GenerateSummaryInput) {
//   const { userId } = await auth();

//   if (!userId) {
//     throw new Error("Unauthorized");
//   }

//   const subscriptionLevel = await getUserSubscriptionLevel(userId);

//   if (!canUseAiTools(subscriptionLevel)) {
//     throw new Error("Upgrade your subscription to use this feature");
//   }

//   const { jobTitle, workExperience, educations, skills } =
//     generateSummarySchema.parse(input);

//   const systemMessage = `
//     You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
//     Only return the summary and do not include any other information in the response. Keep it concise and professional.
//     `;

//   const userMessage = `
//     Please generate a professional resume summary from this data:

//     Job title: ${jobTitle || "N/A"}

//     Work experience:
//     ${workExperience
//       ?.map(
//         (exp) => `
//         Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

//         Description:
//         ${exp.description || "N/A"}
//         `
//       )
//       .join("\n\n")}

//       Education:
//     ${educations
//       ?.map(
//         (edu) => `
//         Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
//         `
//       )
//       .join("\n\n")}

//       Skills:
//       ${skills}
//     `;

//   console.log("systemMessage", systemMessage);
//   console.log("userMessage", userMessage);

//   const completion = await openai.chat.completions.create({
//     model: "deepseek-chat",
//     messages: [
//       {
//         role: "system",
//         content: systemMessage,
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//   });

//   const aiResponse = completion.choices[0].message.content;

//   if (!aiResponse) {
//     throw new Error("Failed to generate AI response");
//   }

//   return aiResponse;
// }

export async function generateSkills(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const { jobTitle, workExperience, educations, skills, jobDescription } =
    generateSummarySchema.parse(input);

  const prompt = `
You are an AI specializing in resume optimization. 
Review the user's data below (including their current skills, work experience, education, and job description) 
to generate a **concise, updated list of skills** that will best match the job requirements and the user’s background.

### Data Provided:
- **Job Title**: ${jobTitle || ""}
- **Work Experiences**:
${workExperience
  ?.map(
    (exp) => `
    Position: ${exp.position || ""}
    Company: ${exp.company || ""}
    Duration: ${exp.startDate || ""} to ${exp.endDate || "Present"}
    Description: ${exp.description || ""}
  `
  )
  .join("\n")}
- **Educations**:
${educations
  ?.map(
    (edu) => `
    Degree: ${edu.degree || ""}
    Institution: ${edu.school || ""}
    Duration: ${edu.startDate || ""} to ${edu.endDate || ""}
  `
  )
  .join("\n")}
- **Current Skills**: ${skills?.join(", ") || ""}
${
  jobDescription && jobDescription.trim().length > 0
    ? `- **Job Description**: ${jobDescription}`
    : ""
}

### Instructions:
1. **Analyze** the user’s existing skills, experience, and (if available) the job description.
2. **Refine** or **expand** the skill list to align with the job requirements:
   - Focus on real skills evident from the user’s background.
   - Add relevant keywords only if they are logically supported by the user’s data or typical to their role.
3. **Output** must be a **JSON array** of strings (e.g., ["Skill One", "Skill Two"]) with:
   - No duplicates
   - No filler text or disclaimers
   - No code fences (\`\`\`) or extra keys

4. **No Additional Explanation**:
   - Do not include any commentary or disclaimers in the response—**only** output the JSON array.
   Return only a JSON array of strings—beginning immediately with [, with no prefix like json or code fences. Do not include backticks, the word ‘json’, or any other text.

Your goal: Return a curated list of resume skills, suitable for ATS scanning, strictly as a JSON array of strings without any additional text.


`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiResponse = response.text().trim();

    aiResponse = aiResponse.replace(/^json\s*/i, "");

    aiResponse = aiResponse.replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(aiResponse);
      return parsed;
    } catch (error) {
      console.error(
        "Parsing AI response as JSON array failed:",
        error,
        aiResponse
      );
      throw new Error("Invalid JSON array response from AI.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate skills. Please try again.");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const { description, jobDescription } =
    generateWorkExperienceSchema.parse(input);

  const prompt = `
  You are an AI that creates a single, detailed work experience entry from a user’s short description.
   work on a better prompt to transform job snippets into comprehensive work experiences, emphasizing real achievements with specific metrics and avoiding fictional data.
   analyze how to transform a brief work experience into a detailed narrative, ensuring a complete, bullet-pointed description in JSON format, adhering to the user's guidelines.
   integrate missing details while maintaining accuracy, ensuring the completion of the work experience narrative with a professional tone, free from fictional content.
  enrich work experiences with logical details and professional language, ensuring they remain accurate and forward-looking.
    refine the prompt to create a comprehensive, bullet-pointed work experience entry. This will ensure it’s factual, logically expanded, and professionally written, avoiding any fictional data.
   refine the approach to maintain a clear, factual narrative by setting unknown dates to null and carefully inferring or expanding details, ensuring no fictional data is included. This ensures progress in maintaining precision.
  Expand and enhance the details in a professional manner while following these rules **exactly**:
  
  1. Produce **only** a valid JSON object with the keys:
  {
    "jobTitle": string,
    "company": string,
    "startDate": "YYYY-MM-DD" or null,
    "endDate": "YYYY-MM-DD" or null,
    "description": string
  }
  
  2. Read this user description carefully :
  "${description}"

  ${(jobDescription?.length ?? 0) > 1 ? `2.5. compare it with job description requirements and keywords ${jobDescription} ` : ``}
  

  3. Your task:
     - Infer or refine job title, company name, relevant dates (if any).
     - For "description", create **4–7** bullet points highlighting:
       • Concrete accomplishments (use numbers or metrics if you can infer/estimate them realistically)  
       • Impact or results achieved  
       • Tools, technologies, or processes used  
       • Collaboration or leadership responsibilities  
  
  4. Strict constraints:
     - Only include details that can be directly inferred from the user's text, or are reasonable generalizations (e.g., typical tasks for that role).
     - **Do not** invent data that contradicts or goes beyond the scope of the user’s text.
     - If no dates are specified, set both "startDate" and "endDate" to null.
     - Output must be **only** the JSON (no extra text, disclaimers, or code blocks).
     - Keys must be camelCase. 
     - In "description", each bullet point **must** start with "- " (hyphen + space).
     -Omit any mention of missing data (like "N/A")—just skip fields that have no data.
  
  Your goal: Write a more robust, achievement-focused entry that shows professional impact, while staying true to the user's text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Clean response and parse JSON
    const jsonString = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedResponse = JSON.parse(jsonString);

    const formattedDescription = parsedResponse.description
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.startsWith("-"))
      .join("\n");

    return {
      position: parsedResponse.jobTitle,
      company: parsedResponse.company,
      startDate: parsedResponse.startDate ?? undefined,
      endDate: parsedResponse.endDate ?? undefined,
      description: formattedDescription,
    } satisfies WorkExperience;
  } catch (error) {
    console.error("Error generating work experience:", error);
    throw new Error("Failed to generate work experience. Please try again.");
  }
}

export async function compareATS(input: GenerateAtsInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const { summary, workExperience, skills, jobDescription } =
    generateAtsSchema.parse(input);

  if (!jobDescription || jobDescription.length < 1) {
    throw new Error("Job description is needed");
  }

  const prompt = `
    You are an advanced AI specialized in optimizing a resume to pass ATS checks.
    Given the user's existing resume data (summary, skills, and work experiences) 
    and a specific job description, refine or expand each section to align with 
    the job requirements while remaining accurate to the user's real background.
    
    ---
    
    **User Data:**
    - Summary: ${summary || ""}
    - Skills: ${skills?.join(", ") || ""}
    - Work Experiences:
      ${workExperience
        ?.map(
          (exp) => `
          Position: ${exp.position || ""} 
          Company: ${exp.company || ""}
          Duration: ${exp.startDate || ""} to ${exp.endDate || "Present"}
          Description: ${exp.description || ""}
        `
        )
        .join("\n")}
    
    ---
    
    **Job Description:**
    ${jobDescription}
    
    ---
    
    ### Your Output Requirements
    
    1. **Return a single JSON object** with **only** these keys at the top level:
       \`\`\`
       {
         "summary": string,
         "skills": string[],
         "workExperience": [
           {
             "jobTitle": string,
             "company": string,
             "startDate": "YYYY-MM-DD" | null,
             "endDate": "YYYY-MM-DD" | null,
             "description": string
           },
           ...
         ]
       }
       \`\`\`
    
    2. **summary** (string):  
       - Refine or rewrite the user’s summary (2–4 sentences) to emphasize the most relevant skills and experiences for the given job description.
       - Do not mention missing data or placeholders like "N/A."
       - Keep it professional and results-oriented.
    
    3. **skills** (array of strings):  
       - Include the user’s original skills.
       - Add any additional skills that can be **logically inferred** from the user’s data or the job description.
       - Do not invent impossible or contradictory skills.
    
    4. **workExperience** (array of objects):  
       - For each user-submitted experience, create or refine an entry with the keys:
         - \`jobTitle\`
         - \`company\`
         - \`startDate\` (YYYY-MM-DD or null)
         - \`endDate\` (YYYY-MM-DD or null)
         - \`description\` (4–7 bullet points)
       - Each bullet point must begin with "- " (hyphen + space).
       - Highlight real achievements, technologies, and impact. Use metrics if you can reasonably infer them.
       - Do **not** fabricate data that contradicts or goes far beyond the user’s text. 
       - If no dates can be inferred, set them to null.
    
    5. **Formatting**:
       - Return **only** valid JSON (no extra keys, no comments, no code blocks).
       - Use camelCase for all keys.
       - Do not include any disclaimers or additional explanations in the response.
    
    ---
    
    **Your goal**: Produce a revised resume (summary, skills, work experience array) that fits the job description more closely, highlights achievements, and remains truthful to the user’s original data. Return only the final JSON object with no extra text.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Remove ```json or ``` or any triple backticks that might appear
    const cleanedText = rawText
      .replace(/```json/g, "") // remove ```json
      .replace(/```/g, "") // remove ```
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    console.log(parsedJson);
    return parsedJson;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate ATS-aligned resume. Please try again.");
  }
}

interface JDExtractedData {
  technicalKeywords: string[];
  industryTerms: string[];
  toolsTechnologies: string[];
  softSkills: string[];
  atsPriorityTerms: string[];
}

interface ResumeExtractedData {
  technicalKeywords: string[];
  industryTerms: string[];
  toolsTechnologies: string[];
  softSkills: string[];
}

export interface ATSComparisonResult {
  scores: {
    technicalKeywords: number;
    industryTerms: number;
    toolsTechnologies: number;
    softSkills: number;
    atsPriorityTerms: number;
  };
  suggestions: {
    technicalKeywords: string;
    industryTerms: string;
    toolsTechnologies: string;
    softSkills: string;
    atsPriorityTerms: string;
  };
  extractedJD: JDExtractedData;
  extractedResume: ResumeExtractedData;
}

export async function analyzeJobDescription(
  input: GenerateAtsInput
): Promise<ATSComparisonResult> {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const subLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAiTools(subLevel))
    throw new Error("Premium subscription required");

  const { jobDescription, summary, skills, workExperience } =
    generateAtsSchema.parse(input);
  if (!jobDescription?.length) throw new Error("Job description required");

  try {
    // Extract data from Job Description
    const jdData = await extractJdData(jobDescription);
    // Extract data from Resume
    const resumeText = createResumeText(summary, skills, workExperience);
    const resumeData = await extractResumeData(resumeText);

    // Compare and score
    const scores = calculateScores(jdData, resumeData, resumeText);
    const suggestions = generateSuggestions(jdData, resumeData, resumeText);
    console.log(scores, suggestions, jdData, resumeData);

    return {
      scores,
      suggestions,
      extractedJD: jdData,
      extractedResume: resumeData,
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Analysis failed. Please try again.");
  }
}

// Helper Functions
async function extractJdData(jd: string): Promise<JDExtractedData> {
  const prompt = `Extract from this job description:
Technical keywords, Industry terms, Tools/technologies, Soft skills, 
and ATS priority terms (certifications, education, experience requirements).
Return JSON with keys: technicalKeywords, industryTerms, toolsTechnologies, 
softSkills, atsPriorityTerms as string arrays. Job Description: ${jd}`;

  return processAIResponse<JDExtractedData>(prompt);
}

async function extractResumeData(
  resumeText: string
): Promise<ResumeExtractedData> {
  const prompt = `Extract from this resume:
Technical keywords, Industry terms, Tools/technologies, Soft skills.
Return JSON with keys: technicalKeywords, industryTerms, toolsTechnologies, 
softSkills as string arrays. Resume: ${resumeText}`;

  return processAIResponse<ResumeExtractedData>(prompt);
}

async function processAIResponse<T>(prompt: string): Promise<T> {
  const result = await model.generateContent(prompt);
  const rawText = (await result.response.text()).trim();
  const cleaned = rawText.replace(/```json|```/g, "");
  return JSON.parse(cleaned);
}

function createResumeText(
  summary?: string,
  skills?: string[],
  workExperience?: WorkExperience[]
): string {
  return [
    summary,
    skills?.join(" "),
    workExperience?.map((exp) => exp.description).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

function calculateScores(
  jd: JDExtractedData,
  resume: ResumeExtractedData,
  resumeText: string
) {
  const scores = {
    technicalKeywords: calculateMatchScore(
      jd.technicalKeywords,
      resume.technicalKeywords
    ),
    industryTerms: calculateMatchScore(jd.industryTerms, resume.industryTerms),
    toolsTechnologies: calculateMatchScore(
      jd.toolsTechnologies,
      resume.toolsTechnologies
    ),
    softSkills: calculateMatchScore(jd.softSkills, resume.softSkills),
    atsPriorityTerms: calculateAtsScore(jd.atsPriorityTerms, resumeText),
  };
  return scores;
}

function calculateMatchScore(jdTerms: string[], resumeTerms: string[]): number {
  if (jdTerms.length === 0) return 0;
  const resumeSet = new Set(resumeTerms.map((t) => t.toLowerCase()));
  const matches = jdTerms.filter((t) => resumeSet.has(t.toLowerCase()));
  return (matches.length / jdTerms.length) * 100;
}

function calculateAtsScore(atsTerms: string[], resumeText: string): number {
  if (atsTerms.length === 0) return 0;
  const text = resumeText.toLowerCase();
  const matches = atsTerms.filter((t) => text.includes(t.toLowerCase()));
  return (matches.length / atsTerms.length) * 100;
}

function generateSuggestions(
  jd: JDExtractedData,
  resume: ResumeExtractedData,
  resumeText: string
) {
  return {
    technicalKeywords: formatSuggestion(
      "Technical keywords",
      jd.technicalKeywords,
      resume.technicalKeywords
    ),
    industryTerms: formatSuggestion(
      "Industry terms",
      jd.industryTerms,
      resume.industryTerms
    ),
    toolsTechnologies: formatSuggestion(
      "Tools/technologies",
      jd.toolsTechnologies,
      resume.toolsTechnologies
    ),
    softSkills: formatSuggestion(
      "Soft skills",
      jd.softSkills,
      resume.softSkills
    ),
    atsPriorityTerms: formatAtsSuggestion(jd.atsPriorityTerms, resumeText),
  };
}

function formatSuggestion(
  category: string,
  jdTerms: string[],
  resumeTerms: string[]
): string {
  const missing = jdTerms.filter(
    (t) => !resumeTerms.some((rt) => rt.toLowerCase() === t.toLowerCase())
  );
  return missing.length > 0
    ? `Missing ${category}: ${missing.join(", ")}`
    : `All key ${category} matched!`;
}

function formatAtsSuggestion(atsTerms: string[], resumeText: string): string {
  const missing = atsTerms.filter(
    (t) => !resumeText.toLowerCase().includes(t.toLowerCase())
  );
  return missing.length > 0
    ? `Critical ATS terms missing: ${missing.join(", ")}`
    : "All ATS priority terms matched!";
}
