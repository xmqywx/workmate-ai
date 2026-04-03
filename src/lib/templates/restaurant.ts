import type { TemplateConfig } from "@/types";

const restaurant: TemplateConfig = {
  slug: "restaurant",
  name: "Restaurant Review Assistant",
  nameZh: "餐饮评价助手",
  description: "自动回复美团/饿了么评价，区分好评中评差评，个性化语气。不回评价=掉排名。",
  industry: "food",
  icon: "🍜",
  systemPrompt: `你是一位专业的餐饮店AI评价回复助手。你的工作是帮助餐厅老板回复外卖平台（美团、饿了么）上的顾客评价。

## 回复原则

### 好评（4-5星）
- 真诚感谢，语气热情
- 提及顾客点名表扬的菜品
- 邀请再次光临
- 适当推荐其他菜品
- 字数控制在50-80字

### 中评（3星）
- 感谢反馈，态度诚恳
- 针对顾客提到的问题给出改进承诺
- 不要辩解，承认不足
- 邀请再给一次机会
- 字数控制在60-100字

### 差评（1-2星）
- 第一时间道歉，态度真诚
- 针对具体问题说明改进措施
- 提供补偿方案（如"下次光临赠送一份小菜"）
- 留下联系方式邀请私聊解决
- 字数控制在80-120字
- 标记[转人工]让老板确认后再发

## 语气风格
- 不要用"亲"（那是电商风格），用"您好"或直接称呼
- 自然亲切，像老板本人在回复
- 每条回复都不一样，避免模板感
- 可以适当用表情符号（不超过2个）`,
  configSchema: [
    {
      key: "restaurant_name",
      label: "Restaurant Name",
      labelZh: "餐厅名称",
      type: "text" as const,
      required: true,
      placeholder: "XX餐厅/XX小吃",
    },
    {
      key: "cuisine_type",
      label: "Cuisine Type",
      labelZh: "菜系类型",
      type: "select" as const,
      required: true,
      options: [
        { value: "chinese", label: "中餐" },
        { value: "hotpot", label: "火锅" },
        { value: "bbq", label: "烧烤" },
        { value: "noodle", label: "面食/小吃" },
        { value: "tea", label: "茶饮/甜品" },
        { value: "western", label: "西餐" },
        { value: "japanese", label: "日料" },
        { value: "other", label: "其他" },
      ],
    },
    {
      key: "signature_dishes",
      label: "Signature Dishes",
      labelZh: "招牌菜品",
      type: "textarea" as const,
      required: false,
      placeholder: "招牌红烧肉、秘制酸菜鱼、手工水饺...",
    },
    {
      key: "menu",
      label: "Menu",
      labelZh: "上传菜单/菜品信息",
      type: "file" as const,
      required: false,
    },
  ],
};

export default restaurant;
