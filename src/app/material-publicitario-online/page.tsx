import type { Metadata } from "next";

import { ExternalResourceView } from "@/components/features/external-resource/external-resource-view";
import { ONLINE_MARKETING_MATERIAL } from "@/constants/external-resources";

export const metadata: Metadata = {
  title: "Material publicitario online · GOcuotas",
};

export default function MaterialPublicitarioOnlinePage() {
  return <ExternalResourceView resource={ONLINE_MARKETING_MATERIAL} />;
}
