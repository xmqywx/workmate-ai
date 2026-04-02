import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { templates } from "@/lib/templates";

export async function GET() {
  try {
    const count = await prisma.template.count();
    if (count === 0) {
      for (const t of templates) {
        await prisma.template.create({
          data: {
            slug: t.slug,
            name: t.name,
            nameZh: t.nameZh,
            description: t.description,
            industry: t.industry,
            icon: t.icon,
            systemPrompt: t.systemPrompt,
            configSchema: JSON.stringify(t.configSchema),
          },
        });
      }
    }

    const all = await prisma.template.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 }
    );
  }
}
