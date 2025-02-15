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
import { ResumeServerData } from "@/lib/types";
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
**ATS Optimization Analysis Task**

Analyze the following job description and resume data with these capabilities:
1. Contextual term matching (recognize equivalent skills/tools)
2. Experience validation (compare durations/levels)
3. Skill hierarchy understanding (basic vs advanced)
4. Semantic similarity scoring
5. ATS priority detection

**Job Description Analysis**:
${jobDescription}

**Resume Analysis**:
${JSON.stringify(resumeData)}

**Output Requirements**:
- Generate JSON with match score and missing elements
- Score calculation weights:
  • ATS Priority Terms: 40%
  • Technical Skills: 30%
  • Technologies: 20%
  • Soft Skills: 10%
- Consider partial matches (e.g., "3 yrs" vs "5+ yrs" = 60% match)
- Recognize equivalent terms (e.g., "ML" = "Machine Learning")

**JSON Structure**:
{
  "score": <0-100 weighted score>,
  "technical": [<missing/exact terms from JD>],
  "industry": [<missing industry jargon/terms>],
  "technologies": [<missing tools/libs/frameworks>],
  "softSkills": [<missing personality traits/abilities>],
  "atsPriorityTerms": [<missing certs/education/exact requirements>]
}

**Critical Instructions**:
1. Validate experience durations match requirements
2. Flag incomplete certification matches
3. Identify missing keyword clusters
4. Prioritize hard requirements over nice-to-haves
5. Never invent or hallucinate missing terms
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Improved JSON extraction with error handling
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const parsedResponse = JSON.parse(jsonMatch[0]);

    // Validation layer
    const requiredKeys = [
      "score",
      "technical",
      "industry",
      "technologies",
      "softSkills",
      "atsPriorityTerms",
    ];
    if (!requiredKeys.every((k) => k in parsedResponse)) {
      throw new Error("Invalid response structure");
    }

    // Normalize score between 0-100
    const finalScore = Math.min(Math.max(parsedResponse.score, 0), 100);

    return {
      score: finalScore,
      technical: parsedResponse.technical || [],
      industry: parsedResponse.industry || [],
      technologies: parsedResponse.technologies || [],
      softSkills: parsedResponse.softSkills || [],
      atsPriorityTerms: parsedResponse.atsPriorityTerms || [],
    };
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    throw new Error("Failed to generate analysis. Please try again.");
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
}): Promise<ResumeServerData> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAiTools(subLevel)) {
    throw new Error("You need a premium subscription to use AI tools.");
  }

  const prompt = `
  **Resume Optimization Task**
  
  You are an expert ATS resume writer. Enhance the following resume by strategically incorporating missing elements from the analysis while preserving the candidate's authentic voice and experience.
  
  **Guidelines**:
  1. **Natural Integration**:
  - Embed missing keywords in contextually appropriate sections
  - Maintain original writing style and verb tense consistency
  - Avoid keyword stuffing - add value, not just keywords
  
  2. **Section-Specific Strategies**:
  - Summary: Blend missing ATS priority terms with existing narrative
  - Skills: Add missing technical/industry terms using original phrasing patterns
  - Experience: 
    • Insert missing technologies/tools into relevant position descriptions
    • Enhance achievements with missing soft skills using CAR (Context-Action-Result) format
    • Add industry terms to project descriptions naturally
  
  3. **Prohibited Actions**:
  - Never invent companies/positions/certifications
  - Don't change existing metrics/achievements
  - Avoid first-person pronouns and passive voice
  
  4. **Formatting Rules**:
  - Keep bullet points under 2 lines
  - Maintain consistent date formats
  - Preserve original section order
  
  **Required Output Structure**:
  {
    "summary": "<enhanced 3-4 line paragraph>",
    "softSkills": ["<array maintaining original+new skills>"],
    "technicalSkills": ["<array preserving original order+new items>"],
    "workExperiences": [
      {
        "id": "<same_id>",
        "description": "<enhanced description with 1-2 new keywords>"
      }
    ]
  }
  
  **Analysis Data**:
  ${JSON.stringify(analysisData)}
  
  **Original Resume**:
  ${JSON.stringify(resumeData)}
  
  **Critical Instructions**:
  1. Prioritize missing ATS priority terms in summary and recent positions
  2. Add missing technical skills to both skills section AND relevant experience bullets
  3. Blend soft skills into achievement statements ("Led team" → "Led cross-functional team using Agile methodology")
  4. Maintain 80% original content - maximum 20% new material
  5. Keep language achievement-oriented and quantifiable
  6. Preserve specialized jargon from original resume
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
      img: resumeData.img,
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

    const res = await saveResume({
      ...updatedResume,
      img: resumeData.img instanceof File ? resumeData.img : undefined,
    });
    revalidatePath(`/dashboard/resumes`);
    revalidatePath(`/dashboard/ats`);

    return res;
  } catch (error) {
    console.error("Error improving resume:", error);
    throw new Error("Failed to improve the resume. Please try again.");
  }
}

export async function generateCover(
  input: GenerateCoverInput,
  resumeData?: ResumeValues
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
${
  resumeData &&
  `
  Resume Data :
  ${JSON.stringify(resumeData)}
`
}

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
