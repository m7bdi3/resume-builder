import OpenAi from "openai";

// const opanai = new OpenAi({
//   baseURL: "https://huggingface.co/api/inference-proxy/together",
//   apiKey: process.env.OPEN_AI_KEY,
// });

const openai = new OpenAi({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API,
});

export default openai;
