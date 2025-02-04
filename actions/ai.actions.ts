"use server";

import {
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

  const { jobTitle, workExperience, educations, skills } =
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

  const { description } = generateWorkExperienceSchema.parse(input);

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
  
  2. Read this user description carefully:
  "${description}"
  
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
