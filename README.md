# WorkMate AI 智工

> 10分钟部署你的AI数字员工，替代80%重复工作

中小企业AI数字员工平台 —— 选行业模板、上传业务数据、AI员工立即上岗。

## 功能

- **3个行业模板**（持续增加中）
  - 🛒 电商客服助手 — 自动回答商品咨询、订单查询、退换货
  - 🌍 外贸询盘助手 — 多语言询盘回复、自动报价、客户跟进
  - 📋 合同审查助手 — 关键条款提取、风险标记、合同摘要
- **知识库** — 上传产品目录/FAQ/合同模板，AI基于你的数据回答
- **Webhook API** — 接入邮件/微信/任何系统
- **执行日志** — 查看所有对话记录和统计

## 快速开始

```bash
git clone https://github.com/xmqywx/workmate-ai.git
cd workmate-ai
npm install
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY (从 https://platform.deepseek.com 获取)
npx prisma db push && npx prisma generate
npm run dev
```

打开 http://localhost:3000

## 使用流程

1. 选择行业模板（电商/外贸/法务）
2. 填写基本信息（公司名、产品信息等）
3. 上传业务数据（产品目录、FAQ、合同模板）
4. 开始对话测试
5. 通过 Webhook API 接入你的业务系统

## API接入

```bash
curl -X POST http://localhost:3000/api/webhook/{workerId} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {worker-api-key}" \
  -d '{"message": "你好，请问这个产品多少钱？"}'
```

## 技术栈

Next.js 14 · SQLite/PostgreSQL · DeepSeek API · Tailwind · shadcn/ui · Prisma

## License

MIT
