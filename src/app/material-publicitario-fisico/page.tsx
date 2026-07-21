import type { Metadata } from "next";

import { PhysicalMaterialRequestView } from "@/components/features/material-fisico/physical-material-request-view";

export const metadata: Metadata = {
  title: "Material publicitario físico · GOcuotas",
};

export default function MaterialPublicitarioFisicoPage() {
  return <PhysicalMaterialRequestView />;
}
