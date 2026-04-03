import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete messages and documents first (cascade)
    await prisma.message.deleteMany({ where: { workerId: id } });
    await prisma.document.deleteMany({ where: { workerId: id } });
    await prisma.worker.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete worker" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["active", "paused"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'active' or 'paused'" },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ id: worker.id, status: worker.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update worker" },
      { status: 500 }
    );
  }
}
