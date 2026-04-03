import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { templates } from "@/lib/templates";

export async function GET() {
  try {
    for (const t of templates) {
      await prisma.template.upsert({
        where: { slug: t.slug },
        update: {
          name: t.name,
          nameZh: t.nameZh,
          description: t.description,
          industry: t.industry,
          icon: t.icon,
          systemPrompt: t.systemPrompt,
          configSchema: JSON.stringify(t.configSchema),
        },
        create: {
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
