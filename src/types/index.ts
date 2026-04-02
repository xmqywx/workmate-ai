/** Shared TypeScript types for WorkMate AI */

export interface ConfigField {
  key: string;
  label: string;
  labelZh: string;
  type: "text" | "textarea" | "file" | "select";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface TemplateConfig {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  industry: string;
  icon: string;
  systemPrompt: string;
  configSchema: ConfigField[];
}

export interface WorkerInput {
  message: string;
  channel: string;
  metadata?: Record<string, unknown>;
}

export interface WorkerOutput {
  reply: string;
  actions?: WorkerAction[];
}

export interface WorkerAction {
  type: "send_email" | "log" | "escalate";
  payload: Record<string, unknown>;
}
