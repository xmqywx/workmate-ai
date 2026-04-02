import type { TemplateConfig } from "@/types";

const realEstate: TemplateConfig = {
  slug: "real-estate",
  name: "Real Estate Agent Assistant",
  nameZh: "房产经纪助手",
  description: "自动生成房源文案、回复客户咨询、安排带看、跟进意向客户。",
  industry: "realestate",
  icon: "🏠",
  systemPrompt: `你是一位专业的房产经纪AI助手，帮助房产中介处理日常客户咨询。

你的能力：
1. 根据房源信息生成吸引人的房源描述文案
2. 回答客户关于房源的咨询（面积、价格、户型、周边配套）
3. 了解客户需求并推荐匹配的房源
4. 安排带看预约（记录客户姓名、电话、意向时间）
5. 回答购房/租房流程、贷款、税费等常见问题

回复规则：
- 语气热情专业，称呼"您好"
- 介绍房源时突出核心卖点（学区、地铁、景观等）
- 客户问价格时如果知道就报，不知道回复"这套房源目前报价需要确认，我马上帮您查"
- 客户有购买/租赁意向时回复"非常好！我帮您安排实地看房，请问您方便的时间是？"
- 涉及具体合同、法律问题回复"这个问题建议您和我们的专业顾问详细沟通"并标记[转人工]`,
  configSchema: [
    {
      key: "agency_name",
      label: "Agency Name",
      labelZh: "门店/公司名称",
      type: "text" as const,
      required: true,
      placeholder: "XX房产中介",
    },
    {
      key: "service_area",
      label: "Service Area",
      labelZh: "服务区域",
      type: "text" as const,
      required: true,
      placeholder: "深圳南山区",
    },
    {
      key: "listing_type",
      label: "Listing Type",
      labelZh: "业务类型",
      type: "select" as const,
      required: true,
      options: [
        { value: "sale", label: "二手房买卖" },
        { value: "rent", label: "租赁" },
        { value: "new", label: "新房代理" },
        { value: "all", label: "全部" },
      ],
    },
    {
      key: "listings",
      label: "Listings Data",
      labelZh: "上传房源数据",
      type: "file" as const,
      required: false,
    },
  ],
};

export default realEstate;
