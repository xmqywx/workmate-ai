import { NextRequest, NextResponse } from "next/server";
import { runWorker } from "@/lib/worker-engine";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, channel = "web" } = body;

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const { allowed, remaining } = checkRateLimit(id);
    if (!allowed) {
      return NextResponse.json(
        { error: "该AI员工已达到每小时调用上限(50次)，请稍后再试。", remaining: 0 },
        { status: 429 }
      );
    }

    const result = await runWorker(id, { message, channel });
    return NextResponse.json({ reply: result.reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
