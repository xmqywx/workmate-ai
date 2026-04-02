import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { chunkText } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const workerId = formData.get("workerId") as string;
    const file = formData.get("file") as File;

    if (!workerId || !file) {
      return NextResponse.json(
        { error: "workerId and file are required" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const chunks = chunkText(text, 800);

    let uploaded = 0;
    for (const chunk of chunks) {
      await prisma.document.create({
        data: { workerId, filename: file.name, content: chunk },
      });
      uploaded++;
    }

    return NextResponse.json({ uploaded, filename: file.name });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
