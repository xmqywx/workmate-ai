"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  id: string;
  role: string;
  content: string;
  channel: string;
  createdAt: string;
}

interface LogViewerProps {
  workerId: string;
}

export function LogViewer({ workerId }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch(`/api/workers/${workerId}/logs`)
      .then((r) => r.json())
      .then(setLogs)
      .catch(() => {});
  }, [workerId]);

  if (logs.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">暂无执行记录</p>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">时间</th>
            <th className="px-4 py-2 text-left">渠道</th>
            <th className="px-4 py-2 text-left">角色</th>
            <th className="px-4 py-2 text-left">内容</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                {new Date(log.createdAt).toLocaleString("zh-CN")}
              </td>
              <td className="px-4 py-2">{log.channel}</td>
              <td className="px-4 py-2">
                {log.role === "user" ? "用户" : "AI"}
              </td>
              <td className="px-4 py-2 max-w-md truncate">{log.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
