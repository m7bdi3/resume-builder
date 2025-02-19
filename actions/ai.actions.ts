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
import { model } from "@/lib/gemini";
import { saveResume } from "./forms.actions";
import { revalidatePath } from "next/cache";
import { ResumeServerData } from "@/lib/types";
import prisma from "@/lib/prisma";
// import openai from "@/lib/openai";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
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

export async function generateSkills(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
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
to generate **separate lists of soft skills and technical skills** that will best match the job requirements and the user’s background.

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
- **Current Soft Skills**: ${softSkills?.join(", ") || ""}
- **Current Technical Skills**: ${technicalSkills?.join(", ") || ""}
${
  jobDescription && jobDescription.trim().length > 0
    ? `- **Job Description**: ${jobDescription}`
    : ""
}

### Instructions:
1. **Analyze** the user's existing skills, experience, and job description (if provided).
2. **Categorize** skills into:
   - Soft Skills: Interpersonal skills, leadership, communication, etc.
   - Technical Skills: Tools, technologies, hard skills, etc.
3. **Enhance** skills based on:
   - Actual experience from work/education
   - Job description requirements
   - Industry-standard keywords for ATS optimization
4. **Output Requirements**:
   - Valid JSON object with two arrays: softSkills and technicalSkills
   - No duplicates in either array
   - No commentary or explanations
   - No markdown formatting

Example Output Format:
{
  "softSkills": ["Team Leadership", "Agile Methodologies"],
  "technicalSkills": ["Python", "AWS", "React"]
}

Return ONLY the JSON object without any additional text or formatting. Begin with { and end with }.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiResponse = response.text().trim();

    // Clean response
    aiResponse = aiResponse
      .replace(/^json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(aiResponse);
      
      // Validate response structure
      if (
        !Array.isArray(parsed.softSkills) ||
        !Array.isArray(parsed.technicalSkills)
      ) {
        throw new Error("Invalid skills structure from AI");
      }

      return {
        softSkills: parsed.softSkills || [],
        technicalSkills: parsed.technicalSkills || []
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error, aiResponse);
      throw new Error("Invalid skills format from AI");
    }
  } catch (error) {
    console.error("Generation error:", error);
    throw new Error("Skills generation failed. Please try again.");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
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

export type AnalyzedData = {
  score: number;
  technical: string[];
  industry: string[];
  technologies: string[];
  softSkills: string[];
  atsPriorityTerms: string[];
};

export async function analyzeJobDescription({
  resumeData,
  jobDescription,
  title,
  id,
}: {
  resumeData: ResumeValues;
  jobDescription: string;
  title: string;
  id?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
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

    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const parsedResponse = JSON.parse(jsonMatch[0]);

    const resultOperation = id
      ? prisma.atsResult.update({
          where: { id, userId }, // Ensure the record belongs to the user
          data: {
            title,
            jobDescription,
            response: parsedResponse,
            resumeId: resumeData.id!,
          },
        })
      : prisma.atsResult.create({
          data: {
            title,
            jobDescription,
            response: parsedResponse,
            userId,
            resumeId: resumeData.id!,
          },
        });

    const res = await resultOperation;
    return { ...res, response: res.response as AnalyzedData };
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    throw new Error("Failed to generate analysis. Please try again.");
  }
}

export async function improveResumeData({
  resumeData,
  analysisData,
}: {
  resumeData: ResumeValues;
  analysisData: AnalyzedData;
}): Promise<ResumeServerData> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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

export type GapAnalysisResult = {
  skillsAndExperienceGaps: Array<{
    gapName: string;
    type: string;
    severity: string;
    jobDescriptionExcerpt: string;
    resumeComparison: string;
    mitigationStrategy: string;
  }>;
  resumeImprovementSuggestions: Array<{
    section: string;
    action: string;
    example: {
      before: string;
      after: string;
      rationale: string;
    };
  }>;
  longTermActionPlan: Array<{
    category: string;
    recommendation: string;
    resources: string[];
    timeframe: string;
  }>;
  prioritizedRoadmap: Array<{
    priority: number;
    task: string;
    expectedImpact: string;
    estimatedEffort: string;
  }>;
};

export async function gapAnalysis({
  resumeData,
  jobDescription,
  title,
  id,
}: {
  resumeData: ResumeValues;
  jobDescription: string;
  title: string;
  id?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const prompt = `
  **Role**: Professional ATS Optimization Specialist, expert career coach and resume strategist.
  
  **Objective**:
  Analyze the candidate's resume against the target job description to create a prioritized, actionable improvement plan. Focus on:
  1 Conduct a Gap Analysis between the user’s current resume and the target job requirements.
  2. Immediate ATS optimization opportunities
  3. Strategic career development recommendations
  4. Quantifiable impact enhancements
  5. Identify missing or underrepresented skills, qualifications, and experiences.
  6. Provide actionable recommendations on how to address these gaps (e.g., resume content improvements, skill-building resources, certifications, or side projects).

  **Input Analysis Requirements**:
  - Cross-reference 5 key areas: Technical Skills, Domain Expertise, Leadership Experience, Education/Certifications, Achievements
  - Identify:
    • Exact matches (strengths to emphasize)
    • Partial matches (areas to enhance)
    • Critical omissions (must-add elements)
    • Keyword density gaps
  
  **Output Structure Requirements**:
  {
    "skillsAndExperienceGaps": [
      {
        "gapName": "...",
        "type": "Hard Skill|Soft Skill|Certification|Experience",
        "severity": "Critical|High|Medium|Low",
        "jobDescriptionExcerpt": "...",
        "resumeComparison": "...",
        "mitigationStrategy": "..."
      }
    ],
    "resumeImprovementSuggestions": [
      {
        "section": "Summary|Work Experience|Skills|Other",
        "action": "Add|Emphasize|Rephrase|Reorganize",
        "example": {
          "before": "...",
          "after": "...",
          "rationale": "..."
        }
      }
    ],
    "longTermActionPlan": [
      {
        "category": "Skill Development|Networking|Certifications|Projects",
        "recommendation": "...",
        "resources": ["...", "..."],
        "timeframe": "Immediate|1-3 months|3-6 months"
      }
    ],
    "prioritizedRoadmap": [
      {
        "priority": 1-5,
        "task": "...",
        "expectedImpact": "ATS Score|First Impression|Hiring Manager Appeal",
        "estimatedEffort": "Low|Medium|High"
      }
    ]
  }
  
  **Critical Rules**:
  1. ATS-Specific Recommendations:
     - Suggest exact keyword placement locations
     - Identify optimal section ordering
     - Recommend measurable metrics integration
     - Flag non-ATS friendly formatting
  
  2. Career Strategy Requirements:
     - Connect gaps to industry trends
     - Suggest transferrable skill highlighting
     - Recommend verifiable achievement formulas
  
  3. Strict Prohibitions:
     - No generic advice - all recommendations must be JD-specific
     - No hypothetical/non-verifiable claims
     - No first-person language
  
  **Input Data**:
  {
    "resumeData": ${JSON.stringify(resumeData, null, 2)},
    "jobDescription": ${JSON.stringify(jobDescription)}
  }
  
  **Response Requirements**:
  - Return only valid JSON matching the specified structure
  - Maximum 5 items per category
  - Sort by priority/severity descending
  - Use real companies/certifications from the candidate's region
  - Include specific course names/platforms for skill development
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

    const requiredKeys = [
      "skillsAndExperienceGaps",
      "resumeImprovementSuggestions",
      "longTermActionPlan",
      "prioritizedRoadmap",
    ];

    if (!requiredKeys.every((k) => k in parsedResponse)) {
      const missingKeys = requiredKeys.filter((k) => !(k in parsedResponse));
      throw new Error(
        `Invalid response structure. Missing keys: ${missingKeys.join(", ")}`
      );
    }

    const arrayKeys = [
      { key: "skillsAndExperienceGaps", minLength: 1 },
      { key: "resumeImprovementSuggestions", minLength: 0 },
      { key: "longTermActionPlan", minLength: 0 },
      { key: "prioritizedRoadmap", minLength: 0 },
    ];

    for (const { key, minLength } of arrayKeys) {
      if (
        !Array.isArray(parsedResponse[key]) ||
        parsedResponse[key].length < minLength
      ) {
        throw new Error(
          `Invalid format for ${key}. Expected array with minimum ${minLength} items`
        );
      }
    }

    const resultOperation = id
      ? prisma.gapResult.update({
          where: { id, userId },
          data: {
            title,
            jobDescription,
            response: parsedResponse,
            resumeId: resumeData.id!,
          },
        })
      : prisma.gapResult.create({
          data: {
            title,
            jobDescription,
            response: parsedResponse,
            userId,
            resumeId: resumeData.id!,
          },
        });

    const res = await resultOperation;
    return { ...res, response: res.response as GapAnalysisResult };
  } catch (error) {
    console.error("GAP Analysis Error:", error);
    throw new Error(
      `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export type IntreviewQS = {
  category: string;
  question: string;
  answer: string;
  context: string;
  complexity: "basic" | "intermediate" | "advanced";
};

export async function intreviewQS({
  jobDescription,
  title,
  id,
}: {
  jobDescription: string;
  title: string;
  id?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const prompt = `
You are an expert interview curator and an expert hiring manager with 20+ years experience in technical recruiting. 
Generate a robust list of interview questions and model answers specifically tailored to this job description:

${jobDescription}

**Task**: 
Generate a comprehensive list of in-depth, role-specific interview questions (at least 15) AND concise, well-structured answers. Each question should test a critical aspect of the role as described in the job description and include enough detail to avoid any generic or overly common interview questions. Reflect on responsibilities, required skills, domain-specific challenges, and any unique organizational context mentioned.

Structure your response with:

1. **Role-Specific Scenarios** (10 questions)
   - Create situational questions about daily challenges in this role
   - Ask for specific technical processes/workflows
   - Require examples of past work

2. **Technical Depth Assessment** (10 questions)
   - Probe specific tools/technologies from the JD
   - Include troubleshooting scenarios
   - Ask for architecture/system design explanations

3. **Behavioral Evaluation** (10 questions)
   - Focus on team dynamics in technical contexts
   - Ask for conflict resolution examples with technical teams
   - Require STAR method responses

4. **Company/Team Alignment** (10 questions)
   - Questions about specific tech stack implementation
   - Cultural alignment with engineering practices
   - Process improvement suggestions

For each question:
- Make answers actionable with concrete examples
- Include success metrics/outcomes
- Reference specific technologies from the JD
- Add "Why This Matters" explaining the question's purpose
- Keep answers under 150 words
- Use industry-specific terminology

**Goal**:
- Provide advanced interview questions that probe deeper into the candidate’s relevant experience, problem-solving capabilities, and situational judgment.
- Keep answers concise yet insightful to demonstrate ideal responses a strong candidate might give.
- Uphold any unique or specialized aspects of the role, reflecting the exact context given by the job description.

Format requirements:
- No markdown
- Avoid generic questions about "strengths/weaknesses"
- Include situational judgment problems for technical decision-making

STRUCTURE REQUIREMENTS:
1. Create 4 categories with exactly 10 questions each:
   - Technical Expertise
   - Problem Solving
   - Team Collaboration
   - Domain Knowledge

2. For EACH question:
   - Question: Must mention specific tools/technologies from JD
   - Answer: Concrete example with metric/result
   - Context: Brief rationale for asking (20 words)
   - Complexity: "basic", "intermediate", or "advanced"

JSON TEMPLATE:
[{
  "category": "Technical Expertise",
  "question": "How would you implement [JD-specific technology] to solve [JD-specific challenge]?",
  "answer": "In my previous role at [Company], I used [technology] to [specific action]... resulting in [metric] improvement",
  "context": "Assesses practical implementation skills",
  "complexity": "intermediate"
}]

STRICT RULES:
- Never use markdown or special formatting
- Include EXACTLY 40 questions (10 per category)
- Answers must reference JD technologies explicitly
- All numbers must be numeric (no spelled-out numbers)
- Never use placeholders like [Company]
- Validate JSON syntax before responding
- Complexity levels must vary appropriately
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    const jsonString = rawText
      .replace(/(```json|```)/g, "")
      .replace(/(\bNaN\b|\bundefined\b)/g, "null")
      .trim();

    const parsedResponse = JSON.parse(jsonString);

    // Validation
    if (!Array.isArray(parsedResponse)) {
      throw new Error("Invalid response " + parsedResponse.length);
    }

    const resultOperation = id
      ? prisma.interviewResult.update({
          where: { id, userId },
          data: {
            title,
            jobDescription,
            response: parsedResponse,
          },
        })
      : prisma.interviewResult.create({
          data: {
            title,
            jobDescription,
            response: parsedResponse,
            userId,
          },
        });

    const res = await resultOperation;
    return { ...res, response: res.response as IntreviewQS[] };
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error(
      `AI response formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
