/**
 * Seed script: populates templates table from code definitions.
 * Run: npx tsx scripts/seed.ts
 */
import { PrismaClient } from "@/generated/prisma";
import { templates } from "@/lib/templates";

async function main() {
  const prisma = new PrismaClient();

  console.log("Seeding templates...");

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
    console.log(`  ✅ ${t.icon} ${t.nameZh} (${t.slug})`);
  }

  console.log(`\nDone! ${templates.length} templates seeded.`);
  await prisma.$disconnect();
}

main().catch(console.error);
