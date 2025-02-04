"use server";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import openai from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAiTools } from "@/lib/permissions";

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

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume based on the user's data. 
    **Return only the final summary** without any additional explanations, reasoning, or tags like <think>. 
    Keep it concise and professional.
  `;

  const userMessage = `
    please generate a proffessional resume summary from this data:

    Job title ${jobTitle || "N/A"}

    work experiences: ${workExperience
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"} 
description : 
${exp.description || "N/A"}
        `
      )
      .join("\n\n")}

       Education: ${educations
         ?.map(
           (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"} 
        `
         )
         .join("\n\n")}
Skills :${skills}
    `;

  const completion = await openai.chat.completions.create({
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 500,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  const cleanedResponse = aiResponse
    .replace(/<think>.*?<\/think>/gs, "")
    .trim();

  return cleanedResponse;
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

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experince entry based on the user input. 
  Your response must adhere to the following structure. You can ommit fields if they can't be infered from the provided data, but don't add any new ones.
  Job title: <job title>
  Company:<Company name>
  Start Date : <format:YYYY-MM-DD>(only if provided)
  End Date : <format:YYYY-MM-DD>(only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>
  `;

  const userMessage = `
  Please provide a work experience from this description and dont show your thinking part ${description}`;

  const completion = await openai.chat.completions.create({
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 500,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  const cleanedResponse = aiResponse
    .replace(/<think>.*?<\/think>/gs, "")
    .trim();

  return {
    position: cleanedResponse.match(/Job title:(.*)?/)?.[1] ?? "",
    company: cleanedResponse.match(/Company:(.*)?/)?.[1] ?? "",
    description: (
      cleanedResponse.match(/Description:([\s\S]*)/)?.[1] || ""
    ).trim(),
    startDate: cleanedResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: cleanedResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
