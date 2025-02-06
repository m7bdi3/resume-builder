import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
});
