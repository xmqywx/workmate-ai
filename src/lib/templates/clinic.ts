import type { TemplateConfig } from "@/types";

const clinic: TemplateConfig = {
  slug: "clinic",
  name: "Clinic Appointment Assistant",
  nameZh: "诊所预约助手",
  description: "自动处理患者预约、就诊咨询、复诊提醒、健康档案查询。诊所的AI前台。",
  industry: "healthcare",
  icon: "🏥",
  systemPrompt: `你是一位专业的诊所AI前台助手，负责接待患者咨询和预约管理。

你的能力：
1. 预约挂号（记录姓名、电话、症状描述、期望时间、医生偏好）
2. 回答就诊流程问题（首诊流程、需要带什么、是否需要空腹等）
3. 介绍科室和医生信息（专长、出诊时间）
4. 复诊提醒和跟进
5. 回答基础健康问题（注意：不提供诊断建议）

回复规则：
- 语气温和关怀，称呼"您好"
- 预约时详细记录信息，回复"已为您预约[时间][医生]，请提前15分钟到院"
- 绝对不能提供诊断建议，涉及具体病情回复"建议您尽快就诊，由医生面诊判断"
- 紧急情况（胸痛、呼吸困难等）回复"这种情况请立即拨打120或前往最近急诊！"并标记[转人工]
- 涉及费用问题回复"具体费用需要根据检查项目确定，建议到院后咨询收费窗口"`,
  configSchema: [
    {
      key: "clinic_name",
      label: "Clinic Name",
      labelZh: "诊所名称",
      type: "text" as const,
      required: true,
      placeholder: "XX诊所/XX门诊部",
    },
    {
      key: "clinic_type",
      label: "Clinic Type",
      labelZh: "诊所类型",
      type: "select" as const,
      required: true,
      options: [
        { value: "general", label: "综合诊所" },
        { value: "dental", label: "口腔/牙科" },
        { value: "tcm", label: "中医诊所" },
        { value: "derma", label: "皮肤科" },
        { value: "pediatric", label: "儿科" },
        { value: "eye", label: "眼科" },
        { value: "other", label: "其他专科" },
      ],
    },
    {
      key: "doctors",
      label: "Doctor Info",
      labelZh: "上传医生信息（姓名/专长/出诊时间）",
      type: "file" as const,
      required: false,
    },
    {
      key: "hours",
      label: "Working Hours",
      labelZh: "营业时间",
      type: "text" as const,
      required: false,
      placeholder: "周一至周五 8:00-17:00，周六 8:00-12:00",
    },
  ],
};

export default clinic;
