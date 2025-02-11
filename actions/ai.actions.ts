"use server";

import {
  GenerateCoverInput,
  generateCoverSchema,
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  ResumeValues,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAiTools } from "@/lib/permissions";
import { model } from "@/lib/gemini";
import { saveResume } from "./forms.actions";
import { revalidatePath } from "next/cache";
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

  const {
    jobTitle,
    workExperience,
    educations,
    technicalSkills,
    softSkills,
    jobDescription,
  } = generateSummarySchema.parse(input);

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
    - softSkills: ${softSkills?.join(", ") || ""}
    - technicalSkills: ${technicalSkills?.join(", ") || ""}

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

  const {
    jobTitle,
    workExperience,
    educations,
    softSkills,
    technicalSkills,
    jobDescription,
  } = generateSummarySchema.parse(input);

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
- **Current Skills**: ${softSkills?.join(", ") || ""} ${technicalSkills?.join(", ") || ""}
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

export async function analyzeJobDescription({
  resumeData,
  jobDescription,
}: {
  resumeData: ResumeValues;
  jobDescription: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const prompt = `
You are an expert resume writer and ATS checker. Your task is to compare the following Job Description with the provided resume data.

**Objectives**:
1. From the job description, identify all relevant:
   - Technical keywords
   - Industry terms
   - Tools/technologies
   - Soft skills
   - ATS priority terms (e.g., certifications, education, experience requirements).

2. From the resume, identify all existing:
   - Technical keywords
   - Industry terms
   - Tools/technologies
   - Soft skills

3. Determine which items from the job description are *missing* in the resume. Then calculate the percentage of overall similarity or match (0–100).

4. Return **only** the missing data from the resume, along with the similarity score, in valid JSON format (no explanations or extra text).

Your output **must** follow this exact JSON structure:

{
  "score": <number from 0 to 100>,
  "technical": <string[] of missing technical keywords>,
  "industry": <string[] of missing industry terms>,
  "technologies": <string[] of missing tools/technologies>,
  "softSkills": <string[] of missing soft skills>,
  "atsPriorityTerms": <string[] of missing ATS priority terms>
}

**Job Description**:
{${jobDescription}}

**Resume**:
{${JSON.stringify(resumeData)}}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    const jsonString = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedResponse = JSON.parse(jsonString);

    return {
      score: parsedResponse.score,
      technical: parsedResponse.technical,
      industry: parsedResponse.industry,
      technologies: parsedResponse.technologies,
      softSkills: parsedResponse.softSkills,
      atsPriorityTerms: parsedResponse.atsPriorityTerms,
    };
  } catch (error) {
    console.error("Error generating comparison:", error);
    throw new Error("Failed to generate comparison. Please try again.");
  }
}

export type AnalyzedData = {
  score: number;
  technical: string[];
  industry: string[];
  technologies: string[];
  softSkills: string[];
  atsPriorityTerms: string[];
};

export async function improveResumeData({
  resumeData,
  analysisData,
}: {
  resumeData: ResumeValues;
  analysisData: AnalyzedData | undefined;
}): Promise<ResumeValues> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const prompt = `
You are an expert resume writer. Below is analysis data that identifies missing elements in the resume for a specific job application.

**Objectives**:
1. Incorporate all **missing** items from the analysis data into the existing resume.
2. Return **only** valid JSON. Do not include additional text, commentary, or explanations.
3. Preserve existing resume information; only modify or append what's needed to address the missing elements.
4. Don't create any imaginary data. Make it realistic to the original resume data exprtise.

**Required JSON structure**:
{
  "summary": string,
  "softSkills": string[],
  "technicalSkills": string[],
  "workExperiences": [
    {
      "id": string,
      "description": string
    }
  ]
}
Analysis Data: {${JSON.stringify(analysisData)}}

Current Resume: {${JSON.stringify(resumeData)}}
`;

  try {
    const result = await model.generateContent(prompt);
    const rawResponse = await result.response;
    const rawText = rawResponse.text().trim();

    const jsonString = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedResponse = JSON.parse(jsonString);

    const updatedWorkExperience =
      resumeData.workExperience?.map((oldExp) => {
        const updatedExp = parsedResponse.workExperiences?.find(
          (item: WorkExperience) => item.id === oldExp.id
        );
        if (!updatedExp) {
          return oldExp;
        }
        return {
          ...oldExp,
          description: updatedExp.description,
        };
      }) ?? [];

    const updatedResume: ResumeValues = {
      ...resumeData,
      summary:
        parsedResponse.summary !== undefined
          ? parsedResponse.summary
          : resumeData.summary,
      softSkills: Array.isArray(parsedResponse.softSkills)
        ? parsedResponse.softSkills
        : resumeData.softSkills,
      technicalSkills: Array.isArray(parsedResponse.technicalSkills)
        ? parsedResponse.technicalSkills
        : resumeData.technicalSkills,
      workExperience: updatedWorkExperience,
    };

    await saveResume(updatedResume);

    revalidatePath(`/resumes/${resumeData.id}`);
    revalidatePath(`/resumes`);

    return updatedResume;
  } catch (error) {
    console.error("Error improving resume:", error);
    throw new Error("Failed to improve the resume. Please try again.");
  }
}

export async function generateCover(
  input: GenerateCoverInput,
  resumeData: ResumeValues
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const { jobDescription } = generateCoverSchema.parse(input);

  const prompt = `
Generate a professional cover letter body in styled HTML format. Follow these rules:

1. Use this structure:
<div class="cover-letter" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 20px auto;">
  <p style="margin-bottom: 15px;">[First paragraph - direct introduction]</p>
  <p style="margin-bottom: 15px;">[Second paragraph - key qualifications]</p>
  <p style="margin-bottom: 15px;">[Third paragraph - enthusiasm and call to action]</p>
</div>

2. Requirements:
- Fill ALL [bracketed placeholders] with context-based content from Resume data 
- Include 2-3 specific metrics/numbers in achievements
- Use minimum 3 exact keywords/phrases from job description
- Final output MUST be valid HTML that passes W3C validation
- Return ONLY the HTML between <div class="cover-letter"> tags
- No markdown, explanations, or non-HTML content
- Don't add any imaginary data. Keep it consise 
- Integrate user’s name and experience from context.
- Do not include any headers, addresses, or signature blocks.
- Maintain a professional, business-appropriate tone.
- Include specific achievements with metrics.
- Reflect job description keywords and skills.
- Use inline CSS for basic formatting.

3. Formatting rules:
- Only use: <div> and <p> tags
- Inline styles ONLY with these permitted properties:
  font-family, line-height, margin, padding, max-width
- Paragraph styling must include: margin-bottom: 15px
- Web-safe typography (size: 14-16px equivalent)
- Strict W3C validation compliance
- No external resources, classes, or IDs
- Clean spacing between paragraphs (no <br> tags)
- Absolute prohibition of: 
  • External CSS • Classes/IDs • Images • Tables
  • Lists • Bold/italic • Any other HTML elements


Job Description:
${JSON.stringify(jobDescription)}

Resume Data :
${JSON.stringify(resumeData)}

Respond ONLY with the styled HTML content between <div class="cover-letter"> tags. Do not include any other elements or explanations.
`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiResponse = response.text().trim();

    // Remove potential code block wrappers
    aiResponse = aiResponse
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract HTML content
    const htmlMatch = aiResponse.match(
      /<div class="cover-letter"[^>]*>([\s\S]*?)<\/div>/i
    );

    if (!htmlMatch) {
      console.error("No valid HTML content found in:", aiResponse);
      throw new Error("AI failed to generate valid HTML content");
    }

    return htmlMatch[0];
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}
