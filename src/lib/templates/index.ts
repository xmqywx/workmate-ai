import type { TemplateConfig } from "@/types";
import contractReview from "./contract-review";
import ecommerceCs from "./ecommerce-cs";
import tradeInquiry from "./trade-inquiry";

export const templates: TemplateConfig[] = [
  contractReview,
  ecommerceCs,
  tradeInquiry,
];

export function getTemplate(slug: string): TemplateConfig | undefined {
  return templates.find((t) => t.slug === slug);
}
