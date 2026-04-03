import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const workers = await prisma.worker.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
      template: {
        select: { nameZh: true, icon: true, industry: true },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Mask API keys - only show last 6 chars
  const masked = workers.map((w) => ({
    ...w,
    apiKeyPreview: "****" + w.apiKey.slice(-6),
    apiKey: undefined,
  }));

  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, templateId, config } = body;

    if (!name || !templateId) {
      return NextResponse.json(
        { error: "name and templateId are required" },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        templateId,
        config: config ? JSON.stringify(config) : "{}",
      },
    });

    // Return full apiKey only on creation (user needs to save it)
    return NextResponse.json(
      {
        id: worker.id,
        name: worker.name,
        apiKey: worker.apiKey,
        message: "请保存你的API Key，它不会再次显示完整版本。",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create worker" },
      { status: 500 }
    );
  }
}
