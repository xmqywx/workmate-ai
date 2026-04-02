import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import prisma from "@/lib/db";
import { chat } from "@/lib/llm";
import { getRelevantContext } from "@/lib/rag";
import type { WorkerInput, WorkerOutput } from "@/types";

interface BuildPromptArgs {
  systemPrompt: string;
  context: string;
  history: ChatCompletionMessageParam[];
  userMessage: string;
}

/**
 * Build the full ChatMessage array for the LLM call.
 * Injects business knowledge base as part of the system prompt.
 */
export function buildPrompt({
  systemPrompt,
  context,
  history,
  userMessage,
}: BuildPromptArgs): ChatCompletionMessageParam[] {
  const systemContent = `${systemPrompt}

## 业务知识库 / Business Knowledge Base
${context || "(暂无相关资料 / No relevant documents available)"}

## 规则 / Rules
1. 请基于以上知识库内容回答用户问题。Answer based on the knowledge base above.
2. 不要捏造信息。如果知识库中没有相关内容，请如实告知。Do not fabricate information.
3. 如果问题超出你的能力范围或需要人工处理，请标记为需要转人工。Escalate to human if unsure.`;

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: userMessage },
  ];

  return messages;
}

/**
 * Core worker execution:
 * 1. Load worker + template from DB
 * 2. Save user message
 * 3. Retrieve RAG context
 * 4. Load conversation history
 * 5. Call LLM
 * 6. Save assistant reply
 * 7. Return result
 */
export async function runWorker(
  workerId: string,
  input: WorkerInput,
): Promise<WorkerOutput> {
  // 1. Load worker with template
  const worker = await prisma.worker.findUniqueOrThrow({
    where: { id: workerId },
    include: { template: true },
  });

  // 2. Save user message
  await prisma.message.create({
    data: {
      workerId,
      role: "user",
      content: input.message,
      channel: input.channel,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });

  // 3. Get RAG context
  const context = await getRelevantContext(workerId, input.message);

  // 4. Load conversation history (last 20 messages)
  const recentMessages = await prisma.message.findMany({
    where: { workerId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const history: ChatCompletionMessageParam[] = recentMessages
    .slice(0, -1) // exclude the message we just saved
    .map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  // 5. Build prompt and call LLM
  const messages = buildPrompt({
    systemPrompt: worker.template.systemPrompt,
    context,
    history,
    userMessage: input.message,
  });

  const reply = await chat(messages);

  // 6. Save assistant reply
  await prisma.message.create({
    data: {
      workerId,
      role: "assistant",
      content: reply,
      channel: input.channel,
    },
  });

  // 7. Check for escalation signals
  const actions: WorkerOutput["actions"] = [];
  if (reply.includes("[转人工]") || reply.includes("[ESCALATE]")) {
    actions.push({
      type: "escalate",
      payload: { reason: "AI requested human handoff", message: input.message },
    });
  }

  return { reply, actions: actions.length > 0 ? actions : undefined };
}
