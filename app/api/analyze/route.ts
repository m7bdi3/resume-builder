import { analyzeJobDescription } from "@/actions/ai.actions";
import { GenerateAtsInput } from "@/lib/validation";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const input: GenerateAtsInput = req.body;
    const result = await analyzeJobDescription(input);
    res.status(200).json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Analysis failed",
    });
  }
}
