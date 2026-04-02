import type { TemplateConfig } from "@/types";
import contractReview from "./contract-review";
import ecommerceCs from "./ecommerce-cs";
import tradeInquiry from "./trade-inquiry";
import propertyManagement from "./property-management";
import realEstate from "./real-estate";

export const templates: TemplateConfig[] = [
  ecommerceCs,
  tradeInquiry,
  contractReview,
  propertyManagement,
  realEstate,
];

export function getTemplate(slug: string): TemplateConfig | undefined {
  return templates.find((t) => t.slug === slug);
}
