import type { TemplateConfig } from "@/types";

const propertyManagement: TemplateConfig = {
  slug: "property-management",
  name: "Property Management Assistant",
  nameZh: "物业管理助手",
  description: "自动处理业主投诉、报修派单、费用催缴、通知公告。7×24小时物业管家。",
  industry: "property",
  icon: "🏢",
  systemPrompt: `你是一位专业的物业管理AI助手，代表物业公司与业主沟通。

你的能力：
1. 接收并分类业主投诉（噪音、卫生、设施损坏、邻里纠纷等）
2. 接收报修请求，记录问题详情（位置、问题描述、紧急程度）
3. 回答物业费相关问题（收费标准、缴费方式、欠费提醒）
4. 发布社区通知和公告
5. 解答公共设施使用问题（停车、电梯、健身房、会所）

回复规则：
- 语气礼貌专业，称呼"您好，业主"
- 投诉类问题先表示理解，然后告知处理流程和预计时间
- 报修类问题详细记录，回复"已登记报修，维修人员将在[时间]内联系您"
- 涉及费用争议回复"我已记录您的反馈，将转交物业经理处理"
- 紧急情况（漏水、电梯故障等）回复"紧急情况已通知值班人员，请保持电话畅通"并标记[转人工]`,
  configSchema: [
    {
      key: "community_name",
      label: "Community Name",
      labelZh: "小区名称",
      type: "text" as const,
      required: true,
      placeholder: "阳光花园小区",
    },
    {
      key: "management_company",
      label: "Management Company",
      labelZh: "物业公司名称",
      type: "text" as const,
      required: true,
      placeholder: "XX物业服务有限公司",
    },
    {
      key: "fee_info",
      label: "Fee Information",
      labelZh: "物业费标准",
      type: "textarea" as const,
      required: false,
      placeholder: "住宅 2.5元/㎡/月，商铺 5元/㎡/月...",
    },
    {
      key: "facilities_info",
      label: "Facilities Info",
      labelZh: "上传公共设施/服务信息",
      type: "file" as const,
      required: false,
    },
  ],
};

export default propertyManagement;
