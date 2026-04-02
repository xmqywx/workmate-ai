import prisma from "@/lib/db";

/**
 * Split text into sentence-aware chunks.
 * Tries to break on sentence boundaries (。.!?！？) while keeping
 * each chunk under maxLen characters.
 */
export function chunkText(text: string, maxLen = 500): string[] {
  const sentences = text.split(/(?<=[。.!?！？\n])/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence;
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Format chunks as a numbered list for inclusion in prompts.
 */
export function buildContext(chunks: string[]): string {
  return chunks.map((chunk, i) => `[${i + 1}] ${chunk}`).join("\n\n");
}

/**
 * Query Document table for content relevant to the query.
 * For MVP, uses simple string-contains matching on SQLite.
 * Falls back to returning all documents if no match is found.
 */
export async function getRelevantContext(
  workerId: string,
  query: string,
  limit = 5,
): Promise<string> {
  // Try to find documents whose content contains the query (or keywords from it)
  const keywords = query
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 5);

  let docs = await prisma.document.findMany({
    where: {
      workerId,
      OR: keywords.map((kw) => ({
        content: { contains: kw },
      })),
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  // Fall back to all docs for this worker if no keyword match
  if (docs.length === 0) {
    docs = await prisma.document.findMany({
      where: { workerId },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  const allChunks = docs.flatMap((doc: { content: string }) => chunkText(doc.content));
  return buildContext(allChunks.slice(0, limit));
}
