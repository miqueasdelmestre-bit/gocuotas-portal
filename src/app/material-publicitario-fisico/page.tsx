import type { Metadata } from "next";

import { PhysicalMaterialRequestView } from "@/components/features/material-fisico/physical-material-request-view";

export const metadata: Metadata = {
  title: "Material publicitario físico · GOcuotas",
};

interface MaterialPublicitarioFisicoPageProps {
  searchParams: Promise<{ utm_source?: string }>;
}

export default async function MaterialPublicitarioFisicoPage({
  searchParams,
}: MaterialPublicitarioFisicoPageProps) {
  const { utm_source: utmSource } = await searchParams;

  return <PhysicalMaterialRequestView utmSource={utmSource} />;
}
