import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const CHINESE_STOP_WORDS = new Set([
  "的",
  "了",
  "是",
  "在",
  "我",
  "你",
  "吗",
  "呢",
  "啊",
  "有",
  "不",
  "这",
  "那",
  "和",
  "就",
  "都",
  "也",
  "很",
  "会",
  "要",
  "把",
  "被",
  "让",
  "给",
  "对",
]);

// Common English stop words to also exclude
const ENGLISH_STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "shall",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "it",
  "this",
  "that",
  "and",
  "or",
  "but",
  "not",
  "no",
  "so",
  "if",
  "as",
  "i",
  "me",
  "my",
  "you",
  "your",
  "he",
  "she",
  "we",
  "they",
  "what",
  "how",
  "when",
  "where",
  "why",
  "which",
]);

function extractKeywords(messages: { content: string }[]): string[] {
  const freq = new Map<string, number>();

  for (const msg of messages) {
    // Split on whitespace, punctuation, and between CJK/non-CJK boundaries
    const words = msg.content
      .toLowerCase()
      .split(/[\s,.\-!?;:'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/)
      .filter((w) => w.length >= 2);

    for (const word of words) {
      if (CHINESE_STOP_WORDS.has(word) || ENGLISH_STOP_WORDS.has(word)) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify worker exists
    const worker = await prisma.worker.findUnique({ where: { id } });
    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const allMessages = await prisma.message.findMany({
      where: { workerId: id },
      select: { role: true, content: true, channel: true, createdAt: true },
    });

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const totalMessages = allMessages.length;
    const todayMessages = allMessages.filter(
      (m) => new Date(m.createdAt) >= todayStart
    ).length;

    const userMessages = allMessages.filter((m) => m.role === "user");
    const aiMessages = allMessages.filter((m) => m.role === "assistant");

    const avgResponseLength =
      aiMessages.length > 0
        ? Math.round(
            aiMessages.reduce((sum, m) => sum + m.content.length, 0) /
              aiMessages.length
          )
        : 0;

    const topQuestions = extractKeywords(userMessages);

    // Hourly distribution (0-23)
    const hourlyDistribution: number[] = new Array(24).fill(0);
    for (const msg of allMessages) {
      const hour = new Date(msg.createdAt).getHours();
      hourlyDistribution[hour]++;
    }

    // Channel distribution
    const channelMap = new Map<string, number>();
    for (const msg of allMessages) {
      channelMap.set(msg.channel, (channelMap.get(msg.channel) || 0) + 1);
    }
    const channels = Object.fromEntries(channelMap);

    return NextResponse.json({
      total_messages: totalMessages,
      today_messages: todayMessages,
      user_messages: userMessages.length,
      ai_messages: aiMessages.length,
      avg_response_length: avgResponseLength,
      top_questions: topQuestions,
      hourly_distribution: hourlyDistribution,
      channels,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
