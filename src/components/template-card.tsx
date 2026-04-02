"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  id: string;
  slug: string;
  icon: string;
  nameZh: string;
  description: string;
  industry: string;
}

const industryLabels: Record<string, string> = {
  ecommerce: "电商",
  trade: "外贸",
  legal: "法务",
  property: "物业",
  realestate: "房产",
  education: "教育",
  healthcare: "医疗",
};

export function TemplateCard({
  id,
  slug,
  icon,
  nameZh,
  description,
  industry,
}: TemplateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          <Badge variant="secondary">
            {industryLabels[industry] || industry}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{nameZh}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        <Link href={`/create/${id}`}>
          <Button className="w-full">创建AI员工</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
