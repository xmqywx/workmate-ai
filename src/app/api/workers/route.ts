import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const workers = await prisma.worker.findMany({
    include: {
      template: true,
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(workers);
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
      include: { template: true },
    });

    return NextResponse.json(worker, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create worker" },
      { status: 500 }
    );
  }
}
