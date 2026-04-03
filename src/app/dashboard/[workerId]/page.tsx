"use client";

import { useEffect, useState, use } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { LogViewer } from "@/components/log-viewer";
import { StatsDashboard } from "@/components/stats-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Worker {
  id: string;
  name: string;
  status: string;
  apiKeyPreview: string;
  createdAt: string;
  template: { nameZh: string; icon: string };
  _count: { messages: number };
}

export default function WorkerDetailPage({
  params,
}: {
  params: Promise<{ workerId: string }>;
}) {
  const { workerId } = use(params);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [tab, setTab] = useState<"chat" | "logs" | "stats">("chat");

  useEffect(() => {
    fetch("/api/workers")
      .then((r) => r.json())
      .then((workers: Worker[]) => {
        const found = workers.find((w) => w.id === workerId);
        if (found) setWorker(found);
      })
      .catch(() => {});
  }, [workerId]);

  if (!worker) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {worker.template.icon} {worker.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {worker.template.nameZh} · {worker._count.messages} 条消息 ·
            创建于 {new Date(worker.createdAt).toLocaleDateString("zh-CN")}
          </p>
        </div>
        <Badge variant={worker.status === "active" ? "default" : "secondary"}>
          {worker.status === "active" ? "运行中" : "已暂停"}
        </Badge>
      </div>

      <div className="mb-4 bg-muted rounded-lg p-3 text-sm">
        <strong>API接入:</strong>{" "}
        <code className="text-xs">
          POST /api/webhook/{worker.id}
        </code>{" "}
        <span className="text-muted-foreground">
          Header: X-API-Key: {worker.apiKeyPreview}
        </span>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const newStatus = worker.status === "active" ? "paused" : "active";
            await fetch(`/api/workers/${workerId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: newStatus }),
            });
            setWorker({ ...worker, status: newStatus });
          }}
        >
          {worker.status === "active" ? "暂停" : "恢复"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            if (!confirm("确定删除该AI员工？所有对话记录将丢失。")) return;
            await fetch(`/api/workers/${workerId}`, { method: "DELETE" });
            window.location.href = "/dashboard";
          }}
        >
          删除
        </Button>
        <div className="flex-1" />
        <Button
          variant={tab === "chat" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("chat")}
        >
          对话测试
        </Button>
        <Button
          variant={tab === "logs" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("logs")}
        >
          执行日志
        </Button>
        <Button
          variant={tab === "stats" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("stats")}
        >
          数据统计
        </Button>
      </div>

      {tab === "chat" ? (
        <ChatInterface workerId={workerId} />
      ) : tab === "logs" ? (
        <LogViewer workerId={workerId} />
      ) : (
        <StatsDashboard workerId={workerId} />
      )}
    </div>
  );
}
