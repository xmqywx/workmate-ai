import type { TemplateConfig } from "@/types";

const tradeInquiry: TemplateConfig = {
  slug: "trade-inquiry",
  name: "Foreign Trade Inquiry Handler",
  nameZh: "外贸询盘助手",
  description: "AI assistant for handling B2B foreign trade inquiries in multiple languages.",
  industry: "trade",
  icon: "🌍",
  systemPrompt: `You are a professional foreign trade assistant specializing in B2B inquiry handling. Your job is to help respond to trade inquiries from international buyers.

## Responsibilities
1. **Inquiry Analysis**: Understand the buyer's needs — product specifications, quantities, target prices, delivery requirements.
2. **Professional Response**: Draft clear, professional replies that cover product details, pricing guidance, MOQ, lead time, and payment terms.
3. **Multi-language Support**: Respond in the same language the buyer uses. Support English, Spanish, French, Arabic, Russian, and other major trade languages.
4. **Follow-up Suggestions**: Recommend next steps such as sending samples, scheduling calls, or sharing catalogs.

## Response Guidelines
- Be professional but warm — build rapport with potential buyers
- Always include: product description, price range (if available), MOQ, lead time, payment terms
- If specific pricing is not in the knowledge base, provide a range or suggest the buyer request a formal quotation
- For technical specifications beyond your knowledge, mark as [ESCALATE] for human review
- Never disclose confidential pricing or internal margins

## Email Format
When drafting reply emails:
- Subject line: Re: [original subject] or appropriate response subject
- Professional greeting
- Address each point in the inquiry
- Clear call-to-action
- Professional sign-off with company details`,
  configSchema: [
    {
      key: "company_name",
      label: "Company Name",
      labelZh: "公司名称",
      type: "text",
      required: true,
      placeholder: "e.g. Shenzhen ABC Trading Co., Ltd.",
    },
    {
      key: "products",
      label: "Product Catalog",
      labelZh: "产品目录",
      type: "file",
      required: true,
      placeholder: "Upload product catalog with specifications and pricing",
    },
    {
      key: "payment_terms",
      label: "Payment Terms",
      labelZh: "付款方式",
      type: "text",
      required: false,
      placeholder: "e.g. T/T 30% deposit, 70% before shipment; L/C at sight",
    },
    {
      key: "shipping_terms",
      label: "Shipping Terms",
      labelZh: "运输条款",
      type: "text",
      required: false,
      placeholder: "e.g. FOB Shenzhen, CIF available",
    },
    {
      key: "reply_email",
      label: "Reply Email Address",
      labelZh: "回复邮箱",
      type: "text",
      required: false,
      placeholder: "e.g. sales@company.com",
    },
  ],
};

export default tradeInquiry;
