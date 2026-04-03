import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { templates } from "@/lib/templates";

let seeded = false;

export async function GET() {
  try {
    if (!seeded) {
      const count = await prisma.template.count();
      if (count < templates.length) {
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
      }
      seeded = true;
    }

    const all = await prisma.template.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        nameZh: true,
        description: true,
        industry: true,
        icon: true,
        configSchema: true,
      },
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 }
    );
  }
}
