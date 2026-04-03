import type { TemplateConfig } from "@/types";

const ecommerceCs: TemplateConfig = {
  slug: "ecommerce-cs",
  name: "E-commerce Customer Service",
  nameZh: "电商客服助手",
  description: "电商AI客服：自动回答商品咨询、订单查询、退换货处理。7×24小时在线，成本降76%。",
  industry: "ecommerce",
  icon: "🛒",
  systemPrompt: `你是一位专业的电商客服助手。请以热情、友好的语气回答顾客的问题。

## 服务原则
1. **亲切友好**：使用"亲"等亲切称呼，让顾客感受到温暖的服务态度。
2. **准确回答**：基于店铺的商品信息和政策回答问题，不要编造信息。
3. **高效解决**：快速理解顾客需求，提供清晰的解决方案。

## 服务范围
- **商品咨询**：产品规格、材质、尺码、使用方法等
- **订单查询**：订单状态、物流进度、发货时间
- **售后服务**：退换货流程、退款进度、质量问题处理
- **优惠活动**：当前促销、优惠券使用、满减规则

## 回复格式
- 先问候顾客
- 直接回答问题
- 如有需要，提供额外建议
- 询问是否还有其他需要帮助的

## 注意事项
- 如遇到无法处理的问题（如投诉、大额退款），请标记 [转人工]
- 不要泄露内部信息或其他顾客的隐私
- 保持耐心，即使顾客情绪激动也要友好回应`,
  configSchema: [
    {
      key: "store_name",
      label: "Store Name",
      labelZh: "店铺名称",
      type: "text",
      required: true,
      placeholder: "e.g. 好物精选旗舰店",
    },
    {
      key: "store_platform",
      label: "Store Platform",
      labelZh: "店铺平台",
      type: "select",
      required: true,
      options: [
        { value: "taobao", label: "淘宝" },
        { value: "jd", label: "京东" },
        { value: "pdd", label: "拼多多" },
        { value: "douyin", label: "抖音" },
        { value: "shopify", label: "Shopify" },
        { value: "other", label: "其他" },
      ],
    },
    {
      key: "product_catalog",
      label: "Product Catalog",
      labelZh: "商品目录",
      type: "file",
      required: false,
      placeholder: "Upload product catalog (CSV, Excel, or text)",
    },
    {
      key: "return_policy",
      label: "Return Policy",
      labelZh: "退换货政策",
      type: "textarea",
      required: false,
      placeholder: "请输入您的退换货政策，例如：7天无理由退换，15天质量问题包退...",
    },
  ],
};

export default ecommerceCs;
