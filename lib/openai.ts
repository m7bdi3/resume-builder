import OpenAi from "openai";

const opanai = new OpenAi({
  baseURL: "https://huggingface.co/api/inference-proxy/together",
  apiKey: process.env.OPEN_AI_KEY,
});

export default opanai;
