"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Worker {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  template: { nameZh: string; icon: string; industry: string };
  _count: { messages: number };
}

export default function DashboardPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    fetch("/api/workers")
      .then((r) => r.json())
      .then(setWorkers)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的AI员工</h1>
        <Link
          href="/"
          className="text-sm text-primary hover:underline"
        >
          + 创建新员工
        </Link>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">还没有AI员工</p>
          <Link href="/" className="text-primary hover:underline">
            去创建第一个
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {workers.map((w) => (
            <Link key={w.id} href={`/dashboard/${w.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{w.template.icon}</span>
                      {w.name}
                    </CardTitle>
                    <Badge
                      variant={w.status === "active" ? "default" : "secondary"}
                    >
                      {w.status === "active" ? "运行中" : "已暂停"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>模板: {w.template.nameZh}</span>
                    <span>消息: {w._count.messages}</span>
                    <span>
                      创建: {new Date(w.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
