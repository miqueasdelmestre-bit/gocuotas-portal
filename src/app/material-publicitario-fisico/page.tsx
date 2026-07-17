import type { Metadata } from "next";

import { ExternalResourceView } from "@/components/features/external-resource/external-resource-view";
import { PHYSICAL_POP_MATERIAL } from "@/constants/external-resources";

export const metadata: Metadata = {
  title: "Material publicitario físico · GOcuotas",
};

export default function MaterialPublicitarioFisicoPage() {
  return <ExternalResourceView resource={PHYSICAL_POP_MATERIAL} />;
}
