"use client";

import { useState, useCallback } from "react";

interface FileUploadProps {
  workerId?: string;
  onUploadComplete?: (result: { uploaded: number; filename: string }) => void;
  accept?: string;
}

export function FileUpload({
  workerId,
  onUploadComplete,
  accept = ".txt,.csv,.md,.json,.pdf",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleUpload = useCallback(
    async (file: File) => {
      if (!workerId) {
        setStatus("请先创建AI员工");
        return;
      }

      setUploading(true);
      setStatus(`上传中: ${file.name}...`);

      try {
        const formData = new FormData();
        formData.append("workerId", workerId);
        formData.append("file", file);

        const res = await fetch("/api/knowledge", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setStatus(`上传成功: ${data.filename} (${data.uploaded}个片段)`);
        onUploadComplete?.(data);
      } catch {
        setStatus("上传失败，请重试");
      } finally {
        setUploading(false);
      }
    },
    [workerId, onUploadComplete]
  );

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
      }}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleUpload(file);
        };
        input.click();
      }}
    >
      {uploading ? (
        <p className="text-sm text-muted-foreground">{status}</p>
      ) : (
        <>
          <p className="text-sm font-medium">
            拖拽文件到这里，或点击选择文件
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            支持 .txt, .csv, .md, .json 格式
          </p>
          {status && (
            <p className="text-xs text-green-600 mt-2">{status}</p>
          )}
        </>
      )}
    </div>
  );
}
