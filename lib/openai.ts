import OpenAi from "openai";

const opanai = new OpenAi({
  baseURL: "https://huggingface.co/api/inference-proxy/together",
  apiKey: "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",
});

export default opanai;
