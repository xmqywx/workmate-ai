"use client";

import { useEffect, useState } from "react";
import { TemplateCard } from "@/components/template-card";

interface Template {
  id: string;
  slug: string;
  icon: string;
  nameZh: string;
  description: string;
  industry: string;
}

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          10分钟部署你的AI数字员工
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          选择行业模板，上传你的业务数据，AI员工立即上岗。
          替代80%重复工作，月费仅几百元。
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">选择行业模板</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            id={t.id}
            slug={t.slug}
            icon={t.icon}
            nameZh={t.nameZh}
            description={t.description}
            industry={t.industry}
          />
        ))}
      </div>

      {templates.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          加载模板中...
        </p>
      )}
    </div>
  );
}
