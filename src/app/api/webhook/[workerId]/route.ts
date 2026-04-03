import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { runWorker } from "@/lib/worker-engine";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workerId: string }> }
) {
  try {
    const { workerId } = await params;
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "X-API-Key header is required" },
        { status: 401 }
      );
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
    });

    if (!worker || worker.apiKey !== apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const { message, channel = "webhook", metadata } = body;

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const { allowed } = checkRateLimit(workerId);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded (50/hour)" },
        { status: 429 }
      );
    }

    const result = await runWorker(workerId, { message, channel, metadata });
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
