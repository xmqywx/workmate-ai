"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";

interface ConfigField {
  key: string;
  label: string;
  labelZh: string;
  type: "text" | "textarea" | "file" | "select";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface Template {
  id: string;
  slug: string;
  icon: string;
  nameZh: string;
  description: string;
  configSchema: string;
}

export default function CreateWorkerPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [workerName, setWorkerName] = useState("");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [createdWorkerId, setCreatedWorkerId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((all: Template[]) => {
        const found = all.find((t) => t.id === templateId);
        if (found) {
          setTemplate(found);
          setWorkerName(found.nameZh);
        }
      })
      .catch(() => {});
  }, [templateId]);

  const fields: ConfigField[] = template
    ? JSON.parse(template.configSchema)
    : [];

  async function handleCreate() {
    if (!template || !workerName) return;

    // Validate required fields
    const missingFields = fields
      .filter((f) => f.required && f.type !== "file" && !config[f.key])
      .map((f) => f.labelZh);
    if (missingFields.length > 0) {
      alert(`请填写必填项：${missingFields.join("、")}`);
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workerName,
          templateId: template.id,
          config,
        }),
      });
      const worker = await res.json();
      setCreatedWorkerId(worker.id);
    } catch {
      alert("创建失败，请重试");
    } finally {
      setCreating(false);
    }
  }

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">加载模板中...</p>
      </div>
    );
  }

  if (createdWorkerId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {template.icon} AI员工创建成功！
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              你可以上传业务数据让AI更懂你的业务，或者直接开始对话测试。
            </p>
            <FileUpload workerId={createdWorkerId} />
            <div className="flex gap-3 justify-center mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/${createdWorkerId}`)
                }
              >
                开始对话测试
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                去看我的员工
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {template.icon} 创建{template.nameZh}
      </h1>
      <p className="text-muted-foreground mb-6">{template.description}</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">
            AI员工名称 *
          </label>
          <Input
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            placeholder="给你的AI员工取个名字"
          />
        </div>

        {fields
          .filter((f) => f.type !== "file")
          .map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium block mb-1">
                {field.labelZh} {field.required && "*"}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  value={config[field.key] || ""}
                  onChange={(e) =>
                    setConfig({ ...config, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : field.type === "select" ? (
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={config[field.key] || ""}
                  onChange={(e) =>
                    setConfig({ ...config, [field.key]: e.target.value })
                  }
                >
                  <option value="">请选择</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={config[field.key] || ""}
                  onChange={(e) =>
                    setConfig({ ...config, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

        <Button
          className="w-full"
          onClick={handleCreate}
          disabled={creating || !workerName}
        >
          {creating ? "创建中..." : "创建AI员工"}
        </Button>
      </div>
    </div>
  );
}
