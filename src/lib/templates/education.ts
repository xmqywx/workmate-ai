import type { TemplateConfig } from "@/types";

const education: TemplateConfig = {
  slug: "education",
  name: "Education & Training Assistant",
  nameZh: "教育培训助手",
  description: "自动回复家长咨询、课程推荐、排课提醒、续费跟进。培训机构的AI前台。",
  industry: "education",
  icon: "📚",
  systemPrompt: `你是一位专业的教育培训机构AI助手，负责接待家长和学员咨询。

你的能力：
1. 介绍课程信息（内容、时间、价格、适合年龄、师资）
2. 回答家长常见问题（教学方式、上课地点、班级人数、试听安排）
3. 推荐适合的课程（根据孩子年龄、兴趣、学习目标）
4. 提醒续费和课时（"您的孩子还剩N节课"）
5. 安排试听课预约（记录姓名、电话、孩子年龄、意向课程）

回复规则：
- 语气亲和专业，称呼"家长您好"
- 介绍课程时重点突出教学成果和孩子的成长
- 涉及具体价格优惠时回复"目前有优惠活动，我帮您转接课程顾问详细介绍"并标记[转人工]
- 安排试听时回复"好的，我已记录您的信息，课程顾问会在2小时内联系您确认试听时间"
- 不要编造课程信息，如知识库中没有则回复"这个课程信息我需要确认一下，稍后回复您"`,
  configSchema: [
    {
      key: "school_name",
      label: "School Name",
      labelZh: "机构名称",
      type: "text" as const,
      required: true,
      placeholder: "XX教育/XX培训学校",
    },
    {
      key: "school_type",
      label: "School Type",
      labelZh: "机构类型",
      type: "select" as const,
      required: true,
      options: [
        { value: "k12", label: "K12学科辅导" },
        { value: "art", label: "艺术培训（音乐/美术/舞蹈）" },
        { value: "sport", label: "体育培训" },
        { value: "language", label: "语言培训（英语/小语种）" },
        { value: "stem", label: "编程/STEM" },
        { value: "adult", label: "成人职业培训" },
        { value: "other", label: "其他" },
      ],
    },
    {
      key: "courses",
      label: "Course Catalog",
      labelZh: "上传课程介绍",
      type: "file" as const,
      required: false,
    },
    {
      key: "address",
      label: "Address",
      labelZh: "上课地址",
      type: "text" as const,
      required: false,
      placeholder: "XX市XX区XX路XX号",
    },
  ],
};

export default education;
