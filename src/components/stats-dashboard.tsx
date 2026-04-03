"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  total_messages: number;
  today_messages: number;
  user_messages: number;
  ai_messages: number;
  avg_response_length: number;
  top_questions: string[];
  hourly_distribution: number[];
  channels: Record<string, number>;
}

interface StatsDashboardProps {
  workerId: string;
}

export function StatsDashboard({ workerId }: StatsDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/workers/${workerId}/stats`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setStats)
      .catch(() => setError(true));
  }, [workerId]);

  if (error) {
    return (
      <p className="text-center text-muted-foreground py-8">
        加载统计数据失败
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-center text-muted-foreground py-8">加载中...</p>
    );
  }

  const maxHourly = Math.max(...stats.hourly_distribution, 1);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="总消息数" value={stats.total_messages} />
        <StatCard title="今日消息" value={stats.today_messages} />
        <StatCard title="用户提问" value={stats.user_messages} />
        <StatCard title="AI回答" value={stats.ai_messages} />
      </div>

      {/* Average response length */}
      <Card>
        <CardHeader>
          <CardTitle>平均回复长度</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats.avg_response_length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              字符
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Hourly distribution bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>消息时段分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-32">
            {stats.hourly_distribution.map((count, hour) => (
              <div
                key={hour}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                  style={{
                    height: `${(count / maxHourly) * 100}%`,
                    minHeight: count > 0 ? "4px" : "0px",
                  }}
                  title={`${hour}:00 - ${count} 条消息`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {stats.hourly_distribution.map((_, hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {hour % 6 === 0 ? `${hour}` : ""}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top questions and channels side by side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Top questions */}
        <Card>
          <CardHeader>
            <CardTitle>热门关键词</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无数据</p>
            ) : (
              <ol className="space-y-2">
                {stats.top_questions.map((keyword, i) => (
                  <li key={keyword} className="flex items-center gap-2 text-sm">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{keyword}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Channel distribution */}
        <Card>
          <CardHeader>
            <CardTitle>渠道分布</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.channels).length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无数据</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.channels)
                  .sort(([, a], [, b]) => b - a)
                  .map(([channel, count]) => {
                    const percentage = Math.round(
                      (count / stats.total_messages) * 100
                    );
                    return (
                      <div key={channel} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{channel}</span>
                          <span className="text-muted-foreground">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/70 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
