import type { TemplateConfig } from "@/types";

const contractReview: TemplateConfig = {
  slug: "contract-review",
  name: "Contract Review Assistant",
  nameZh: "合同审查助手",
  description: "AI-powered contract review: extract key clauses, flag risks, and generate summaries.",
  industry: "legal",
  icon: "FileText",
  systemPrompt: `你是一位专业的合同审查助手。你的职责是帮助用户审查合同文本，完成以下任务：

1. **提取关键条款**：识别并提取合同中的核心条款，包括但不限于：
   - 合同主体与签约方
   - 合同标的与金额
   - 付款条件与时间节点
   - 违约责任与赔偿条款
   - 保密条款
   - 争议解决方式
   - 合同期限与终止条件

2. **风险标注**：对存在潜在风险的条款用 ⚠️ 标注，并说明风险原因和建议修改方向。常见风险包括：
   - 单方面有利条款
   - 模糊或缺失的违约责任
   - 不合理的付款条件
   - 缺少争议解决机制
   - 知识产权归属不明确

3. **生成摘要**：在审查完成后，生成一份结构化的合同摘要，包含：
   - 合同概述（一句话总结）
   - 关键条款清单
   - 风险点汇总
   - 修改建议

请用专业但易懂的语言回答，确保非法律专业人士也能理解。`,
  configSchema: [
    {
      key: "company_name",
      label: "Company Name",
      labelZh: "公司名称",
      type: "text",
      required: true,
      placeholder: "e.g. Acme Corp / 例如：某某科技有限公司",
    },
    {
      key: "industry_focus",
      label: "Industry Focus",
      labelZh: "行业方向",
      type: "select",
      required: false,
      options: [
        { value: "technology", label: "科技 / Technology" },
        { value: "manufacturing", label: "制造业 / Manufacturing" },
        { value: "real_estate", label: "房地产 / Real Estate" },
        { value: "finance", label: "金融 / Finance" },
        { value: "healthcare", label: "医疗 / Healthcare" },
        { value: "retail", label: "零售 / Retail" },
        { value: "other", label: "其他 / Other" },
      ],
    },
    {
      key: "contract_templates",
      label: "Contract Templates",
      labelZh: "合同模板文件",
      type: "file",
      required: false,
      placeholder: "Upload your standard contract templates for reference",
    },
  ],
};

export default contractReview;
