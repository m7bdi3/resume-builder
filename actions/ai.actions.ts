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
