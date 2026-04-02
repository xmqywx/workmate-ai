import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
});

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export async function chat(
  messages: ChatCompletionMessageParam[],
  options: ChatOptions = {},
): Promise<string> {
  const { temperature = 0.7, maxTokens = 2048, model = "deepseek-chat" } = options;

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content ?? "";
}
