import type { TemplateConfig } from "@/types";
import contractReview from "./contract-review";
import ecommerceCs from "./ecommerce-cs";
import tradeInquiry from "./trade-inquiry";
import propertyManagement from "./property-management";
import realEstate from "./real-estate";
import education from "./education";
import clinic from "./clinic";
import restaurant from "./restaurant";

export const templates: TemplateConfig[] = [
  ecommerceCs,
  tradeInquiry,
  contractReview,
  propertyManagement,
  realEstate,
  education,
  clinic,
  restaurant,
];

export function getTemplate(slug: string): TemplateConfig | undefined {
  return templates.find((t) => t.slug === slug);
}
